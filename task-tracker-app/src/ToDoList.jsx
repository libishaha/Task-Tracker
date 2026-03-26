import React, { useState, useEffect } from "react";

function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            backgroundColor: ["#ff4d6d","#ff8fa3","#ffccd5","#fff0f3","#c9184a","#590d22"][i % 6],
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function ToDoList() {
  const [tasks, setTasks] = useState([
    { text: "Crochet a sunflower", done: false, time: Date.now() - 120000 },
    { text: "Work Out", done: false, time: Date.now() - 60000 },
    { text: "Take a walk", done: false, time: Date.now() },
  ]);
  const [newTask, setNewTask] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount && !justCompleted) {
      setShowConfetti(true);
      setJustCompleted(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    if (completedCount < totalCount) {
      setJustCompleted(false);
    }
  }, [completedCount, totalCount]);

  function handleInputChange(e) {
    setNewTask(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTask();
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, { text: newTask.trim(), done: false, time: Date.now() }]);
      setNewTask("");
    }
  }

  function toggleDone(index) {
    setTasks((t) =>
      t.map((task, i) => (i === index ? { ...task, done: !task.done } : task))
    );
  }

  function deleteTask(index) {
    setTasks((t) => t.filter((_, i) => i !== index));
  }

  function clearCompleted() {
    setTasks((t) => t.filter((task) => !task.done));
  }

  function moveUp(index) {
    if (index > 0) {
      const updated = [...tasks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setTasks(updated);
    }
  }

  function moveDown(index) {
    if (index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);
    }
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="app-wrapper">
      <Confetti active={showConfetti} />
      <div className="todo-card">
        {/* Header */}
        <div className="todo-header">
          <h1 className="todo-title">My To Do List</h1>
          <p className="todo-subtitle">one task at a time</p>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="progress-section">
            <div className="progress-label">
              <span>{completedCount} of {totalCount} completed</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="input-row">
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task…"
            value={newTask}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="add-btn" onClick={addTask} aria-label="Add task">
            <span>+</span>
          </button>
        </div>

        {/* Task List */}
        <ul className="task-list">
          {tasks.length === 0 && (
            <li className="empty-state">
              <span>All Done! Add more tasks!</span>
            </li>
          )}
          {tasks.map((task, index) => (
            <li key={index} className={`task-item ${task.done ? "done" : ""}`}>
              <button
                className={`check-btn ${task.done ? "checked" : ""}`}
                onClick={() => toggleDone(index)}
                aria-label={task.done ? "Mark incomplete" : "Mark complete"}
              >
                {task.done ? "✿" : "○"}
              </button>
              <div className="task-content">
                <span className="task-text">{task.text}</span>
                <span className="task-time">{formatTime(task.time)}</span>
              </div>
              <div className="task-actions">
                <button className="move-btn" onClick={() => moveUp(index)} aria-label="Move up">▲</button>
                <button className="move-btn" onClick={() => moveDown(index)} aria-label="Move down">▼</button>
                <button className="delete-btn" onClick={() => deleteTask(index)} aria-label="Delete task">✕</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer actions */}
        {completedCount > 0 && (
          <div className="footer-actions">
            <button className="clear-btn" onClick={clearCompleted}>
              🌸 Clear {completedCount} completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDoList;