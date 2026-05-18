import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [detailData, setDetailData] = useState(null); // { application, documents }
  const [detailLoading, setDetailLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

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

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full detail (application + documents) for the view modal
  const openDetailModal = async (app) => {
    setDetailData({ application: app, documents: [] });
    setDetailLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/admin/applications/${app.application_id}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      setDetailData(data);
    } catch (err) {
      console.error("Failed to fetch application detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => setDetailData(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-emerald-100 text-emerald-600";
    if (status === "Rejected") return "bg-red-100 text-red-500";
    return "bg-amber-100 text-amber-600";
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setEditForm({
      applicant_name: app.applicant_name,
      annual_income: app.annual_income,
      status: app.status,
      next_step: app.next_step || "",
    });
  };

  const closeEditModal = () => setEditingApp(null);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      await fetch(
        `${API_URL}/api/admin/applications/${editingApp.application_id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            status: editForm.status,
            nextStep: editForm.next_step,
          }),
        }
      );
    } catch (err) {
      console.error("Failed to update on server:", err);
    }

    const updatedApplications = applications.map((app) => {
      if (app.application_id === editingApp.application_id) {
        return {
          ...app,
          applicant_name: editForm.applicant_name,
          annual_income: editForm.annual_income,
          status: editForm.status,
          next_step: editForm.next_step,
        };
      }
      return app;
    });

    setApplications(updatedApplications);

    setStats((prev) => ({
      ...prev,
      approvedApplications: updatedApplications.filter(
        (a) => a.status === "Approved"
      ).length,
      pendingApplications: updatedApplications.filter(
        (a) => a.status === "Pending"
      ).length,
    }));

    // Also sync detail modal if open for same app
    if (detailData?.application?.application_id === editingApp.application_id) {
      setDetailData((prev) => ({
        ...prev,
        application: {
          ...prev.application,
          status: editForm.status,
          next_step: editForm.next_step,
        },
      }));
    }

    alert("Application updated successfully!");
    closeEditModal();
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scheme_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50 text-gray-900 overflow-hidden relative">

      {/* Background blobs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-400/40 blur-3xl rounded-full"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 70, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Admin</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">Dashboard</span>
            </h1>
            <p className="text-gray-500 mt-3">Manage applications and monitor approvals.</p>
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
          {[
            { label: "Total Schemes", value: stats.totalSchemes, color: "from-cyan-400 to-blue-600", textColor: "text-cyan-500" },
            { label: "Applications", value: stats.totalApplications, color: "from-violet-400 to-fuchsia-600", textColor: "text-violet-500" },
            { label: "Approved", value: stats.approvedApplications, color: "from-emerald-400 to-teal-600", textColor: "text-emerald-500" },
            { label: "Pending", value: stats.pendingApplications, color: "from-amber-400 to-orange-500", textColor: "text-amber-500" },
          ].map(({ label, value, color, textColor }) => (
            <motion.div
              key={label}
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl"
            >
              <div className={`h-1 bg-gradient-to-r ${color} rounded-full mb-5`} />
              <h2 className="text-gray-500">{label}</h2>
              <p className={`text-4xl font-bold ${textColor} mt-3`}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-[400px]">
              <span className="absolute left-4 top-3 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search applicant or scheme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Applications</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-violet-100 text-left">
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Scheme</th>
                  <th className="p-4">Income</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.application_id}
                      className="border-b border-violet-50 hover:bg-violet-50/40 transition-all"
                    >
                      <td className="p-4 font-semibold">{app.applicant_name}</td>
                      <td className="p-4 text-gray-500 text-sm">{app.email}</td>
                      <td className="p-4">{app.scheme_name}</td>
                      <td className="p-4">₹ {Number(app.annual_income).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(app.submitted_on).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() => openEditModal(app)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDetailModal(app)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ANALYTICS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
            <h3 className="text-gray-500">Approval Rate</h3>
            <p className="text-4xl font-bold text-emerald-500 mt-4">
              {applications.length > 0
                ? Math.round((applications.filter((a) => a.status === "Approved").length / applications.length) * 100)
                : 0}%
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
            <h3 className="text-gray-500">Pending Reviews</h3>
            <p className="text-4xl font-bold text-amber-500 mt-4">
              {applications.filter((a) => a.status === "Pending").length}
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
            <h3 className="text-gray-500">Rejected Applications</h3>
            <p className="text-4xl font-bold text-red-500 mt-4">
              {applications.filter((a) => a.status === "Rejected").length}
            </p>
          </motion.div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingApp && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Application</h2>
                <button onClick={closeEditModal} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
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
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
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
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW / DETAIL MODAL */}
      <AnimatePresence>
        {detailData && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-2xl my-auto"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Application Details</h2>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      closeDetailModal();
                      openEditModal(detailData.application);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow hover:scale-105 transition-all text-sm"
                  >
                    Edit Status
                  </button>
                  <button onClick={closeDetailModal} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
                </div>
              </div>

              {detailLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Status badge */}
                  <div className="mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(detailData.application.status)}`}>
                      {detailData.application.status}
                    </span>
                  </div>

                  {/* Section: Applicant Info */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Applicant Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DetailCard label="Full Name" value={detailData.application.applicant_name} bg="bg-cyan-50" />
                      <DetailCard label="Email" value={detailData.application.email} bg="bg-violet-50" />
                      <DetailCard label="Phone" value={detailData.application.phone || "—"} bg="bg-sky-50" />
                      <DetailCard label="Aadhaar Number" value={detailData.application.aadhaar_number || "—"} bg="bg-indigo-50" />
                      <DetailCard label="State" value={detailData.application.state || "—"} bg="bg-purple-50" />
                      <DetailCard label="Annual Income" value={`₹ ${Number(detailData.application.annual_income).toLocaleString()}`} bg="bg-emerald-50" />
                    </div>
                  </div>

                  {/* Section: Scheme Info */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Scheme Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DetailCard label="Scheme Name" value={detailData.application.scheme_name} bg="bg-fuchsia-50" />
                      <DetailCard label="Ministry" value={detailData.application.ministry || "—"} bg="bg-pink-50" />
                      <DetailCard label="Category" value={detailData.application.category || "—"} bg="bg-rose-50" />
                      <DetailCard label="Income Limit" value={detailData.application.income_limit ? `₹ ${Number(detailData.application.income_limit).toLocaleString()}` : "—"} bg="bg-orange-50" />
                      <DetailCard label="Deadline" value={detailData.application.deadline || "—"} bg="bg-amber-50" />
                      <DetailCard label="Processing Days" value={detailData.application.processing_days || "—"} bg="bg-yellow-50" />
                    </div>
                    {detailData.application.benefit_description && (
                      <div className="mt-4 bg-gradient-to-r from-cyan-50 to-violet-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-400 mb-1">Benefit Description</p>
                        <p className="text-gray-700 text-sm">{detailData.application.benefit_description}</p>
                      </div>
                    )}
                  </div>

                  {/* Section: Admin Remarks */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Admin Remarks</h3>
                    <div className="bg-gradient-to-r from-cyan-50 to-violet-50 rounded-2xl p-5">
                      <p className="text-gray-700">
                        {detailData.application.next_step || "No remarks yet. Verification in progress."}
                      </p>
                    </div>
                  </div>

                  {/* Section: Submitted Documents */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      Submitted Documents ({detailData.documents?.length || 0})
                    </h3>
                    {detailData.documents?.length === 0 ? (
                      <p className="text-gray-400 text-sm py-4">No documents uploaded for this application.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {detailData.documents.map((doc) => {
                          // file_url is stored as a relative path e.g. /uploads/file.pdf
                          // Prefix with backend base URL so the browser can resolve it
                          const fileHref = doc.file_url?.startsWith("http")
                            ? doc.file_url
                            : `${API_URL}${doc.file_url}`;
                          const isPdf = doc.file_url?.toLowerCase().endsWith(".pdf");
                          return (
                          <a
                            key={doc.upload_id}
                            href={fileHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-cyan-300 hover:bg-cyan-50 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white text-lg flex-shrink-0">
                              {isPdf ? "📕" : "📄"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-cyan-600">
                                {doc.document_name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="ml-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-all text-lg">↗</span>
                          </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Small reusable detail card
function DetailCard({ label, value, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-800 text-sm">{value}</p>
    </div>
  );
}

export default AdminDashboard;
