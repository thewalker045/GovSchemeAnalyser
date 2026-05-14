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

  const [editingApp, setEditingApp] = useState(null);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const [editForm, setEditForm] = useState({
    applicant_name: "",
    annual_income: "",
    status: "",
    next_step: "",
  });

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
        setApplications(data);
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

  // Status colors
  const getStatusColor = (status) => {
    if (status === "Approved") {
      return "bg-emerald-100 text-emerald-600";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-500";
    }

    return "bg-amber-100 text-amber-600";
  };

  // Open edit modal
  const openEditModal = (app) => {
    setEditingApp(app);

    setEditForm({
      applicant_name: app.applicant_name,
      annual_income: app.annual_income,
      status: app.status,
      next_step: app.next_step || "",
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingApp(null);
  };

  // Handle edit form
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes
  const saveChanges = () => {
    const updatedApplications = applications.map(
      (app) => {
        if (
          app.application_id ===
          editingApp.application_id
        ) {
          return {
            ...app,
            applicant_name:
              editForm.applicant_name,
            annual_income:
              editForm.annual_income,
            status: editForm.status,
            next_step: editForm.next_step,
          };
        }

        return app;
      }
    );

    setApplications(updatedApplications);

    const approved =
      updatedApplications.filter(
        (a) => a.status === "Approved"
      ).length;

    const pending =
      updatedApplications.filter(
        (a) => a.status === "Pending"
      ).length;

    setStats((prev) => ({
      ...prev,
      approvedApplications: approved,
      pendingApplications: pending,
    }));

    alert("Application updated successfully!");

    closeEditModal();
  };

  // Filter applications
  const filteredApplications =
    applications.filter((app) => {

      const matchesSearch =
        app.applicant_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        app.scheme_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" ||
        app.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50 text-gray-900 overflow-hidden relative">

      {/* Background blobs */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-400/40 blur-3xl rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-violet-400/40 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10"
        >

          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Admin
              </span>{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">
                Dashboard
              </span>

            </h1>

            <p className="text-gray-500 mt-3">
              Manage applications and monitor approvals.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Logout
          </button>

        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mb-5" />

            <h2 className="text-gray-500">
              Total Schemes
            </h2>

            <p className="text-4xl font-bold text-cyan-500 mt-3">
              {stats.totalSchemes}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-violet-400 to-fuchsia-600 rounded-full mb-5" />

            <h2 className="text-gray-500">
              Applications
            </h2>

            <p className="text-4xl font-bold text-violet-500 mt-3">
              {stats.totalApplications}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full mb-5" />

            <h2 className="text-gray-500">
              Approved
            </h2>

            <p className="text-4xl font-bold text-emerald-500 mt-3">
              {stats.approvedApplications}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-5" />

            <h2 className="text-gray-500">
              Pending
            </h2>

            <p className="text-4xl font-bold text-amber-500 mt-3">
              {stats.pendingApplications}
            </p>
          </motion.div>

        </div>

        {/* SEARCH + FILTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl mb-8"
        >

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

            <div className="relative w-full lg:w-[400px]">

              <span className="absolute left-4 top-3 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search applicant or scheme..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="flex gap-3 flex-wrap">

              {[
                "All",
                "Pending",
                "Approved",
                "Rejected",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setFilterStatus(status)
                  }
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-600"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
        >

          <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 rounded-full mb-6" />

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Manage Applications
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-violet-100 text-left">

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

                  <th className="p-4">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredApplications.map((app) => (
                  <tr
                    key={app.application_id}
                    className="border-b border-violet-50 hover:bg-violet-50/40 transition-all"
                  >

                    <td className="p-4 font-semibold">
                      {app.applicant_name}
                    </td>

                    <td className="p-4">
                      {app.scheme_name}
                    </td>

                    <td className="p-4">
                      ₹{" "}
                      {Number(
                        app.annual_income
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>

                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(
                        app.submitted_on
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <div className="flex gap-3 flex-wrap">

                        <button
                          onClick={() =>
                            openEditModal(app)
                          }
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setSelectedApplication(app)
                          }
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                        >
                          View
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </motion.div>

        {/* ANALYTICS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >

            <h3 className="text-gray-500">
              Approval Rate
            </h3>

            <p className="text-4xl font-bold text-emerald-500 mt-4">

              {applications.length > 0
                ? Math.round(
                    (applications.filter(
                      (a) =>
                        a.status === "Approved"
                    ).length /
                      applications.length) *
                      100
                  )
                : 0}
              %

            </p>

          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >

            <h3 className="text-gray-500">
              Pending Reviews
            </h3>

            <p className="text-4xl font-bold text-amber-500 mt-4">

              {
                applications.filter(
                  (a) =>
                    a.status === "Pending"
                ).length
              }

            </p>

          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
          >

            <h3 className="text-gray-500">
              Rejected Applications
            </h3>

            <p className="text-4xl font-bold text-red-500 mt-4">

              {
                applications.filter(
                  (a) =>
                    a.status === "Rejected"
                ).length
              }

            </p>

          </motion.div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl"
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Edit Application
              </h2>

              <button
                onClick={closeEditModal}
                className="text-2xl text-gray-400"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="applicant_name"
                value={editForm.applicant_name}
                onChange={handleChange}
                placeholder="Applicant Name"
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="number"
                name="annual_income"
                value={editForm.annual_income}
                onChange={handleChange}
                placeholder="Annual Income"
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

              <textarea
                name="next_step"
                value={editForm.next_step}
                onChange={handleChange}
                placeholder="Remarks / Next Step"
                rows="4"
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none resize-none"
              />

              <button
                onClick={saveChanges}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg"
              >
                Save Changes
              </button>

            </div>

          </motion.div>

        </div>
      )}

      {/* VIEW MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl"
          >

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Application Details
              </h2>

              <button
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="text-2xl text-gray-400"
              >
                ✕
              </button>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-cyan-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Applicant Name
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {
                    selectedApplication.applicant_name
                  }
                </h3>

              </div>

              <div className="bg-violet-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Scheme
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedApplication.scheme_name}
                </h3>

              </div>

              <div className="bg-emerald-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Income
                </p>

                <h3 className="text-xl font-bold mt-2">
                  ₹{" "}
                  {Number(
                    selectedApplication.annual_income
                  ).toLocaleString()}
                </h3>

              </div>

              <div className="bg-pink-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedApplication.status}
                </h3>

              </div>

            </div>

            <div className="mt-6 bg-gradient-to-r from-cyan-50 to-violet-50 rounded-2xl p-5">

              <p className="text-sm text-gray-500">
                Admin Remarks
              </p>

              <p className="text-gray-700 mt-3">
                {selectedApplication.next_step ||
                  "Verification in progress."}
              </p>

            </div>

          </motion.div>

        </div>
      )}
    </div>
  );
}

export default AdminDashboard;