import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, done: 0, overdue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/projects");
      let allTasks = [];
      for (let p of res.data) {
        const t = await API.get(`/tasks/project/${p._id}`);
        allTasks = [...allTasks, ...t.data];
      }
      
      const now = new Date();
      setStats({
        total: allTasks.length,
        done: allTasks.filter(t => t.status === "DONE").length,
        overdue: allTasks.filter(t => t.status !== "DONE" && new Date(t.dueDate) < now).length
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Workspace Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-blue-500">
          <p className="text-gray-400 uppercase text-sm font-semibold">Total Tasks</p>
          <h3 className="text-4xl font-bold">{stats.total}</h3>
        </div>
        <div className="card border-l-4 border-green-500">
          <p className="text-gray-400 uppercase text-sm font-semibold">Completed</p>
          <h3 className="text-4xl font-bold">{stats.done}</h3>
        </div>
        <div className="card border-l-4 border-red-500">
          <p className="text-gray-400 uppercase text-sm font-semibold">Overdue</p>
          <h3 className="text-4xl font-bold text-red-400">{stats.overdue}</h3>
        </div>
      </div>
    </div>
  );
}