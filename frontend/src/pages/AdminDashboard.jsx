import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { getToken, logout } from "../utils/auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSchemes: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/applications`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setApplications(data.slice(0, 5)); // Show only recent 5
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">
          Admin Dashboard
        </h1>

        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Total Schemes</h2>
          <p className="text-3xl font-bold text-cyan-400 mt-2">
            {stats.totalSchemes}+
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Applications</h2>
          <p className="text-3xl font-bold text-purple-400 mt-2">
            {stats.totalApplications}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Approved Users</h2>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {stats.approvedApplications}
          </p>
        </div>

      </div>

      {/* RECENT APPLICATIONS */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Recent Applications
        </h2>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3">Applicant</th>
              <th className="p-3">Scheme</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.application_id} className="border-b border-slate-700">
                <td className="p-3">{app.user_name}</td>
                <td className="p-3">{app.scheme_name}</td>
                <td className="p-3 text-yellow-400">{app.status}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );

export default AdminDashboard;