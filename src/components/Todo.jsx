import { useState, useEffect } from "react";
import { Trash2, Edit, Check, X } from "lucide-react";
import GradientText from "./GradientText";

export default function Todo() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTasks = localStorage.getItem("todo-list");
        return savedTasks ? JSON.parse(savedTasks) : [];
      } catch (error) {
        console.error("Failed to load todos:", error);
        return [];
      }
    }
    return [];
  });

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todo-list", JSON.stringify(tasks));
    }
  }, [tasks]);

  const AddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const taskObject = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, taskObject]);
    setNewTask("");
  };

  const getTasks = () => {
    switch (currentFilter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  const TaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const EditTask = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const EditTaskDone = (id) => {
    if (!editingText.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  const DeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const visibleTasks = getTasks();

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-500 bg-clip-text mb-6">
            <GradientText
              colors={["#8E54E9", "#4776E6", "#8E54E9", "#4776E6", "#8E54E9"]}
              animationSpeed={3}
              showBorder={false}
            >
              Todo App
            </GradientText>
          </h1>

          <form onSubmit={AddTask} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </form>

          <div className="flex gap-2">
            {["all", "active", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setCurrentFilter(filterType)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentFilter === filterType
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Tasks ({visibleTasks.length})
          </h2>

          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-700 rounded-lg p-4 flex items-center justify-between group hover:bg-gray-650 transition-colors duration-200"
              >
                {editingId === task.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 bg-gray-600 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => EditTaskDone(task.id)}
                      className="text-green-400 hover:text-green-300 p-1"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => TaskCompletion(task.id)}
                        className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-700"
                      />
                      <span
                        className={`text-gray-200 ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => EditTask(task)}
                        className="text-gray-400 hover:text-gray-200 p-1"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => DeleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {visibleTasks.length === 0 && (
              <div className="text-center text-gray-400 py-6">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
