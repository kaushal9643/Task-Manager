import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const currentUserId = user?._id;

  const load = async () => {
    try {
      const res = await API.get(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");

      const members = res.data.filter(u => u.role === "MEMBER");
      setUsers(members);
    } catch (err) {
      console.log("Fetch users failed", err);
    }
  };

  useEffect(() => {
    load();
    loadUsers();
  }, [projectId]);

  const create = async () => {
    if (!title || !assignedTo || !dueDate) {
      return alert("Fill all fields");
    }

    try {
      await API.post("/tasks", {
        title,
        project: projectId,
        assignedTo,
        dueDate,
      });

      setTitle("");
      setAssignedTo("");
      setDueDate("");
      load();
    } catch {
      alert("Error creating task");
    }
  };

  const update = async (id, status) => {
    await API.put(`/tasks/${id}/status`, { status });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* HEADER */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/projects")}
          className="text-gray-400 hover:text-purple-400 mb-4"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold">Project Tasks</h2>
      </div>

      {/* ADMIN TASK CREATION */}
      {role === "ADMIN" && (
        <div className="bg-gray-800 p-6 rounded mb-8">
          <h4 className="text-purple-400 mb-4">Create Task</h4>

          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="input"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign Member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button className="btn" onClick={create}>
              Add Task
            </button>
          </div>
        </div>
      )}

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No tasks yet</p>
      ) : (
        tasks.map((t) => {
          const isMine = t.assignedTo?._id === currentUserId;

          return (
            <div
              key={t._id}
              className={`bg-gray-800 p-4 mb-3 rounded flex justify-between ${
                isMine ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div>
                <p className="font-bold">{t.title}</p>
                <p className="text-sm text-gray-400">
                  {t.assignedTo?.name || "Unassigned"} | {t.status}
                </p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(t.dueDate).toLocaleDateString()}
                </p>
              </div>

              {/* STATUS BUTTONS */}
              {isMine && t.status !== "DONE" && (
                <div className="space-x-2">
                  <button
                    className="btn-sm"
                    onClick={() => update(t._id, "IN_PROGRESS")}
                  >
                    Start
                  </button>
                  <button
                    className="btn-sm bg-green-500"
                    onClick={() => update(t._id, "DONE")}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}