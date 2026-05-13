import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      setStats(data);

    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/applications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setApplications(data.slice(0, 5));
      } else {
        setApplications([]);
      }

    } catch (err) {
      console.error(
        "Failed to fetch applications:",
        err
      );

    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Status color
  const getStatusColor = (status) => {
    if (status === "Approved") {
      return "text-emerald-400";
    }

    if (status === "Rejected") {
      return "text-red-400";
    }

    return "text-yellow-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 relative overflow-hidden">
      {/* Background */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        className="absolute bottom-[-140px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full"
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold">
              <span className="text-cyan-400">
                Admin
              </span>{" "}
              <span className="text-purple-400">
                Dashboard
              </span>
            </h1>

            <p className="text-gray-400 mt-2">
              Monitor applications and schemes.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Total Schemes */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#0b1020]/90 border border-white/10 p-6 rounded-2xl shadow-2xl"
          >
            <h2 className="text-gray-400">
              Total Schemes
            </h2>

            <p className="text-4xl font-bold text-cyan-400 mt-3">
              {stats.totalSchemes}+
            </p>
          </motion.div>

          {/* Applications */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#0b1020]/90 border border-white/10 p-6 rounded-2xl shadow-2xl"
          >
            <h2 className="text-gray-400">
              Applications
            </h2>

            <p className="text-4xl font-bold text-purple-400 mt-3">
              {stats.totalApplications}
            </p>
          </motion.div>

          {/* Approved */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#0b1020]/90 border border-white/10 p-6 rounded-2xl shadow-2xl"
          >
            <h2 className="text-gray-400">
              Approved Users
            </h2>

            <p className="text-4xl font-bold text-emerald-400 mt-3">
              {stats.approvedApplications}
            </p>
          </motion.div>
        </div>

        {/* RECENT APPLICATIONS */}
        <div className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">
            Recent Applications
          </h2>

          {applications.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4">
                      Applicant
                    </th>

                    <th className="p-4">
                      Scheme
                    </th>

                    <th className="p-4">
                      Income
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                    <th className="p-4">
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.application_id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      {/* Applicant */}
                      <td className="p-4 font-medium">
                        {app.applicant_name}
                      </td>

                      {/* Scheme */}
                      <td className="p-4">
                        {app.scheme_name}
                      </td>

                      {/* Income */}
                      <td className="p-4">
                        Rs.{" "}
                        {Number(
                          app.annual_income
                        ).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td
                        className={`p-4 font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-gray-400">
                        {new Date(
                          app.submitted_on
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;