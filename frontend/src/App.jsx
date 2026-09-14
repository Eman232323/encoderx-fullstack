import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

const emptyTask = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [showRegister, setShowRegister] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        return;
      }

      setTasks(data);
    } catch (error) {
      alert("Could not load tasks. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      alert("Server connection failed. Make sure backend is running.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Now login.");

      setShowRegister(false);

      setRegisterData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      alert("Server connection failed. Make sure backend is running.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setTasks([]);
    setIsLoggedIn(false);
    setShowTaskForm(false);
    setEditingTaskId(null);
  };

  const openAddTask = () => {
    setEditingTaskId(null);
    setTaskForm(emptyTask);
    setShowTaskForm(true);
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    setTaskForm(emptyTask);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      logout();
      return;
    }

    try {
      const url = editingTaskId
        ? `${API_URL}/api/tasks/${editingTaskId}`
        : `${API_URL}/api/tasks`;

      const method = editingTaskId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(taskForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not save task");
        return;
      }

      if (editingTaskId) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editingTaskId ? data.task : task
          )
        );
      } else {
        setTasks((currentTasks) => [data.task, ...currentTasks]);
      }

      closeTaskForm();
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task._id);

    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Pending",
      priority: task.priority || "Medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });

    setShowTaskForm(true);
  };

  const deleteTask = async (id) => {
    const currentToken = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not delete task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      alert("Server connection failed.");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const title = task.title || "";
      const description = task.description || "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <nav className="navbar">
          <h2>
            EncoderX <span>Task Manager</span>
          </h2>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </nav>

        <main className="dashboard-content">
          <div className="welcome-section">
            <p className="small-title">DASHBOARD</p>

            <h1>
              Welcome, {user?.name || "User"} 👋
            </h1>

            <p>
              Manage your tasks, track your progress and stay productive.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>📋</h3>
              <p>Total Tasks</p>
              <strong>{totalTasks}</strong>
            </div>

            <div className="stat-card">
              <h3>⏳</h3>
              <p>Pending</p>
              <strong>{pendingTasks}</strong>
            </div>

            <div className="stat-card">
              <h3>🚀</h3>
              <p>In Progress</p>
              <strong>{progressTasks}</strong>
            </div>

            <div className="stat-card">
              <h3>✅</h3>
              <p>Completed</p>
              <strong>{completedTasks}</strong>
            </div>
          </div>

          <section className="tasks-section">
            <div>
              <h2>My Tasks</h2>

              <p>
                {tasks.length === 0
                  ? "You don't have any tasks yet."
                  : `${tasks.length} task${
                      tasks.length !== 1 ? "s" : ""
                    } in your workspace.`}
              </p>
            </div>

            <button className="primary-btn" onClick={openAddTask}>
              + Add Task
            </button>
          </section>

          <section className="task-controls">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </section>

          {showTaskForm && (
            <div className="task-form-card">
              <div className="form-header">
                <div>
                  <h2>
                    {editingTaskId ? "Edit Task" : "Create New Task"}
                  </h2>

                  <p>
                    {editingTaskId
                      ? "Update your task details."
                      : "Add a new task to your workspace."}
                  </p>
                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={closeTaskForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleTaskSubmit}>
                <label>Task Title</label>

                <input
                  type="text"
                  placeholder="e.g. Complete internship project"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <label>Description</label>

                <textarea
                  placeholder="Describe your task..."
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                />

                <div className="form-row">
                  <div>
                    <label>Status</label>

                    <select
                      value={taskForm.status}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label>Priority</label>

                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label>Due Date</label>

                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeTaskForm}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="primary-btn">
                    {editingTaskId ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          )}
          <section className="task-list">
            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>

                <h3>Loading tasks...</h3>

                <p>Please wait while your tasks are loaded.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>

                <h3>
                  {tasks.length === 0
                    ? "No tasks yet"
                    : "No matching tasks"}
                </h3>

                <p>
                  {tasks.length === 0
                    ? "Create your first task and start managing your work."
                    : "Try changing your search or filters."}
                </p>

                {tasks.length === 0 && (
                  <button
                    className="primary-btn"
                    onClick={openAddTask}
                  >
                    Create First Task
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <div className="task-main">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>

                      <span
                        className={`priority-badge ${
                          task.priority
                            ? task.priority.toLowerCase().replace(" ", "-")
                            : "medium"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="task-description">
                        {task.description}
                      </p>
                    )}

                    <div className="task-meta">
                      <span className="status-badge">
                        {task.status}
                      </span>

                      {task.dueDate && (
                        <span>
                          📅{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar landing-nav">
        <h2>
          EncoderX <span>Task Manager</span>
        </h2>

        <button
          className="nav-login-btn"
          onClick={() => setShowRegister(false)}
        >
          Login
        </button>
      </nav>

      {!showRegister ? (
        <main className="auth-container">
          <div className="hero-text">
            <p className="badge">
              🚀 FULL STACK TASK MANAGER
            </p>

            <h1>
              Organize your work.
              <span> Get things done.</span>
            </h1>

            <p>
              A simple and powerful task management platform built
              with React, Node.js, Express and MongoDB.
            </p>
          </div>

          <div className="auth-card">
            <h2>Welcome Back 👋</h2>

            <p>Login to manage your tasks</p>

            <form onSubmit={handleLogin}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="primary-btn full-btn"
              >
                Login
              </button>
            </form>

            <p className="switch-text">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
              >
                Create one
              </button>
            </p>
          </div>
        </main>
      ) : (
        <main className="auth-container register-page">
          <div className="hero-text">
            <p className="badge">✨ JOIN ENCODERX</p>

            <h1>
              Start managing your
              <span> tasks today.</span>
            </h1>

            <p>
              Create an account and keep all your tasks organized in
              one place.
            </p>
          </div>

          <div className="auth-card">
            <h2>Create Account 🚀</h2>

            <p>Register to get started</p>

            <form onSubmit={handleRegister}>
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="primary-btn full-btn"
              >
                Create Account
              </button>
            </form>

            <p className="switch-text">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(false)}
              >
                Login
              </button>
            </p>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;