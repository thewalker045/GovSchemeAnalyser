import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";
import { getToken, getUser, logout } from "../utils/auth";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  const user = getUser();
  const userName = user?.fullName || "Citizen User";

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("govconnect_token");
    localStorage.removeItem("govconnect_user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  };

  const getProgressWidth = (status) => {
    if (status === "Approved") return "100%";
    if (status === "Rejected") return "65%";
    return "45%";
  };

  const totalApplications = applications.length;

  const submittedApplications = applications.filter(
    (app) => app.status === "Submitted"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    const searchValue = searchText.toLowerCase();

    const matchesSearch =
      app.scheme_name?.toLowerCase().includes(searchValue) ||
      app.category?.toLowerCase().includes(searchValue) ||
      app.ministry?.toLowerCase().includes(searchValue) ||
      app.applicant_name?.toLowerCase().includes(searchValue) ||
      String(app.application_id).toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-violet-50 text-gray-900">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-8 py-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xl text-cyan-600 font-bold"
        >
          Loading applications...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#67e8f9,_transparent_32%),radial-gradient(circle_at_bottom_right,_#f0abfc,_transparent_34%),linear-gradient(135deg,_#ecfeff,_#ffffff,_#f5f3ff,_#fff7ed)] text-gray-900 relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 90, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-140px] left-[-130px] w-96 h-96 bg-cyan-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 70, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-[-140px] right-[-130px] w-96 h-96 bg-fuchsia-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, 55, 0], y: [0, -40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute top-[28%] right-[18%] w-80 h-80 bg-yellow-300/35 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-7">
        {/* Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl px-5 py-4 shadow-[0_18px_60px_rgba(14,165,233,0.14)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              A
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  My
                </span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-orange-400">
                  Applications
                </span>
              </h1>

              <p className="text-sm text-gray-500">
                Track submitted scheme applications
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-100 text-sm font-bold text-gray-800 shadow-sm">
              [{userName}]
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white border border-cyan-100 text-cyan-700 font-bold hover:bg-cyan-50 hover:shadow-md transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-white border border-violet-100 text-violet-700 font-bold hover:bg-violet-50 hover:shadow-md transition"
            >
              Schemes
            </button>

            <button
              onClick={() => alert("Customer care support will be available soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-bold hover:bg-emerald-50 hover:shadow-md transition"
            >
              Customer Care
            </button>

            <button
              onClick={() => alert("Chat feature coming soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-orange-100 text-orange-700 font-bold hover:bg-orange-50 hover:shadow-md transition"
            >
              Chat
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 font-bold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl p-7 sm:p-9 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_20px_70px_rgba(79,70,229,0.14)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-transparent to-fuchsia-100/60 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="inline-block px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-sm font-bold">
                {totalApplications} applications submitted
              </p>

              <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-5 text-gray-950">
                Track every application from submission to approval.
              </h2>

              <p className="text-gray-600 mt-4 max-w-3xl">
                View status, verification steps, applicant details, and next actions in one simple place.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white font-black shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.03] transition"
            >
              Apply For New Scheme
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          {[
            {
              title: "Total",
              value: totalApplications,
              detail: "All submitted applications",
              color: "from-cyan-400 to-blue-600",
            },
            {
              title: "Submitted",
              value: submittedApplications,
              detail: "Under verification",
              color: "from-violet-400 to-fuchsia-600",
            },
            {
              title: "Approved",
              value: approvedApplications,
              detail: "Successfully approved",
              color: "from-emerald-400 to-teal-600",
            },
            {
              title: "Rejected",
              value: rejectedApplications,
              detail: "Needs attention",
              color: "from-red-400 to-rose-600",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -7 }}
              className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_14px_50px_rgba(79,70,229,0.12)]"
            >
              <div
                className={`w-16 h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-5 shadow-md`}
              />

              <p className="text-sm text-gray-500 font-semibold">{item.title}</p>

              <h2 className="text-3xl font-black mt-2 text-gray-950">
                {item.value}
              </h2>

              <p className="text-xs text-gray-500 mt-2">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-5 shadow-[0_18px_60px_rgba(14,165,233,0.12)] flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
        >
          <input
            type="text"
            placeholder="Search by scheme, ministry, applicant, category or application ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full lg:max-w-xl p-3.5 rounded-2xl bg-white border border-cyan-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition"
          />

          <div className="flex flex-wrap gap-2">
            {["All", "Submitted", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-bold border transition ${
                  statusFilter === status
                    ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white border-transparent shadow-lg"
                    : "bg-white text-gray-600 border-gray-100 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Empty */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-10 text-center shadow-[0_18px_60px_rgba(14,165,233,0.12)]"
          >
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-xl" />

            <h2 className="text-2xl font-black text-gray-950 mt-6">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Apply for a government scheme to track your status here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white font-black shadow-lg hover:scale-[1.03] transition"
            >
              Apply Now
            </button>
          </motion.div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-10 text-center shadow-[0_18px_60px_rgba(14,165,233,0.12)]"
          >
            <h2 className="text-2xl font-black text-gray-950">
              No Matching Applications
            </h2>

            <p className="text-gray-500 mt-3">
              Try changing the search text or status filter.
            </p>

            <button
              onClick={() => {
                setSearchText("");
                setStatusFilter("All");
              }}
              className="mt-6 px-6 py-3 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-700 font-black hover:bg-cyan-100 transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 mt-10">
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.application_id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_14px_50px_rgba(14,165,233,0.12)] hover:shadow-[0_22px_70px_rgba(217,70,239,0.18)] transition relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/0 via-fuchsia-100/0 to-orange-100/0 group-hover:from-cyan-100/70 group-hover:via-fuchsia-50/60 group-hover:to-orange-100/60 transition pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between gap-4 flex-wrap">
                    <div>
                      <p className="inline-block px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-xs text-cyan-700 font-black">
                        {app.category}
                      </p>

                      <h2 className="text-xl font-black mt-3 text-gray-950">
                        {app.scheme_name}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1 font-medium">
                        {app.ministry}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-4 py-2 rounded-full border text-sm font-black ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-5">
                    <div className="bg-white/90 border border-cyan-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500">Application ID</p>

                      <h3 className="text-sm font-black mt-1 text-gray-900">
                        GC-{app.application_id}
                      </h3>
                    </div>

                    <div className="bg-white/90 border border-violet-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500">Submitted On</p>

                      <h3 className="text-sm font-black mt-1 text-gray-900">
                        {new Date(app.submitted_on).toLocaleDateString()}
                      </h3>
                    </div>

                    <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500">Applicant</p>

                      <h3 className="text-sm font-black mt-1 text-gray-900">
                        {app.applicant_name}
                      </h3>
                    </div>

                    <div className="bg-white/90 border border-orange-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500">Annual Income</p>

                      <h3 className="text-sm font-black mt-1 text-gray-900">
                        Rs. {Number(app.annual_income).toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-gray-900">
                        Application Progress
                      </p>

                      <p className="text-xs text-gray-500 font-bold">
                        {app.next_step || "Verification in progress"}
                      </p>
                    </div>

                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-cyan-100 mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: getProgressWidth(app.status) }}
                        transition={{ duration: 1 }}
                        className={`h-full ${
                          app.status === "Rejected"
                            ? "bg-gradient-to-r from-red-400 to-rose-600"
                            : app.status === "Approved"
                            ? "bg-gradient-to-r from-emerald-400 to-teal-600"
                            : "bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500"
                        }`}
                      />
                    </div>

                    <div className="space-y-4 mt-5">
                      <div className="flex gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-400 mt-1 shadow-sm" />

                        <div>
                          <h4 className="text-sm font-black text-gray-900">
                            Application Submitted
                          </h4>

                          <p className="text-xs text-gray-500">
                            Your application has been received.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-4 h-4 rounded-full bg-cyan-400 mt-1 shadow-sm" />

                        <div>
                          <h4 className="text-sm font-black text-gray-900">
                            Document Verification
                          </h4>

                          <p className="text-xs text-gray-500">
                            {app.next_step || "Documents are being checked."}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex gap-3 ${
                          app.status === "Approved" ? "" : "opacity-60"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mt-1 shadow-sm ${
                            app.status === "Approved"
                              ? "bg-emerald-500"
                              : app.status === "Rejected"
                              ? "bg-red-400"
                              : "bg-gray-300"
                          }`}
                        />

                        <div>
                          <h4 className="text-sm font-black text-gray-900">
                            Final Decision
                          </h4>

                          <p className="text-xs text-gray-500">
                            {app.status === "Approved"
                              ? "Your application has been approved."
                              : app.status === "Rejected"
                              ? "Your application needs attention."
                              : "Awaiting officer review."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <button
                        onClick={() =>
                          alert(`Application ID: GC-${app.application_id}`)
                        }
                        className="px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 font-bold hover:bg-cyan-100 transition"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => alert("Support request opened.")}
                        className="px-4 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 font-bold hover:bg-violet-100 transition"
                      >
                        Get Help
                      </button>

                      <button
                        onClick={() => alert("Chat feature coming soon.")}
                        className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 font-bold hover:bg-orange-100 transition"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;
