import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const load = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const addMemberToProject = async (projectId) => {
  const email = prompt("Enter the Member's email to add them to this project:");
  if (email) {
    try {
      await API.post(`/projects/${projectId}/add-member`, { email });
      alert("Member added to project team!");
      load();
    } catch (err) {
      alert("User not found or already in project.");
    }
  }
};

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/projects", { name });
      setName("");
      load();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2">Projects</h2>
            <p className="text-gray-400">Team workspace management and oversight.</p>
          </div>

          {/* ADMIN ONLY */}
          {role === "ADMIN" && (
            <div className="flex w-full md:w-auto gap-3 bg-gray-800 p-2 rounded-xl border border-gray-700">
              <input
                className="bg-transparent px-4 outline-none text-sm flex-1"
                placeholder="Project name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-semibold"
                onClick={create}
              >
                Create
              </button>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            No projects yet 🚀
          </div>
        )}

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-gray-800 p-6 rounded-xl shadow hover:scale-[1.03] transition"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                  PROJ
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                <span className="text-xs text-gray-400">
                  {p.members?.length || 1} members
                </span>

                <button
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-sm"
                  onClick={() => navigate(`/tasks/${p._id}`)}
                >
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}