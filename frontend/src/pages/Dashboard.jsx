import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logout, getUser, getToken } from "../utils/auth";
import API_URL from "../config";

function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalApplications = applications.length;

  const submittedApplications = applications.filter(
    (app) => app.status?.toLowerCase() === "submitted"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status?.toLowerCase() === "approved"
  ).length;

  const latestApplication = [...applications].sort(
    (a, b) => new Date(b.submitted_on) - new Date(a.submitted_on)
  )[0];

  const userName = user?.fullName || "Citizen User";
  const userState = user?.state || latestApplication?.state || "India";

  const recommendedSchemes = [
    {
      name: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      incomeLimit: "Rs. 5,00,000",
      match: "92%",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Ayushman Bharat Yojana",
      category: "Healthcare",
      incomeLimit: "Rs. 3,00,000",
      match: "88%",
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "National Scholarship Scheme",
      category: "Education",
      incomeLimit: "Rs. 2,50,000",
      match: "81%",
      color: "from-purple-500 to-fuchsia-600",
    },
  ];

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

  if (!user) return null;

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

      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute top-[30%] right-[10%] w-72 h-72 bg-pink-300/30 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
        className="absolute bottom-[20%] left-[5%] w-64 h-64 bg-emerald-300/30 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              Welcome,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600">
                {userName}
              </span>
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl">
              Your personalized government scheme dashboard.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-3 rounded-xl bg-white/70 border border-cyan-100 hover:bg-cyan-50 transition font-medium text-gray-700 shadow-md"
            >
              Browse Schemes
            </button>

            <button
              onClick={() => navigate("/my-applications")}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-cyan-200"
            >
              My Applications
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-red-200"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
          {[
            {
              title: "Total Applications",
              value: totalApplications,
              detail: "Applications submitted",
              color: "from-cyan-400 to-blue-600",
            },
            {
              title: "Under Review",
              value: submittedApplications,
              detail: "Pending verification",
              color: "from-purple-400 to-fuchsia-600",
            },
            {
              title: "Approved",
              value: approvedApplications,
              detail: "Approved schemes",
              color: "from-emerald-400 to-teal-600",
            },
            {
              title: "State",
              value: userState,
              detail: "User location",
              color: "from-amber-400 to-orange-600",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`w-14 h-1 rounded-full bg-gradient-to-r ${item.color} mb-5`}
              />

              <p className="text-sm text-gray-500">{item.title}</p>

              <h2 className="text-3xl font-bold mt-2 text-gray-800">
                {item.value}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Latest Application + Profile */}
        <div className="grid xl:grid-cols-[1.4fr_1fr] gap-6 mt-8">

          {/* Latest Application */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Latest Application
            </h2>

            {latestApplication ? (
              <div className="mt-6 bg-gradient-to-br from-white/90 to-violet-50 border border-violet-100 shadow-md rounded-xl p-5">

                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-cyan-500 font-semibold">
                      {latestApplication.category}
                    </p>

                    <h3 className="text-xl font-bold mt-2 text-gray-800">
                      {latestApplication.scheme_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {latestApplication.ministry}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full h-fit ${
                      latestApplication.status?.toLowerCase() === "approved"
                        ? "bg-emerald-100 text-emerald-600"
                        : latestApplication.status?.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-500"
                        : "bg-cyan-100 text-cyan-600"
                    }`}
                  >
                    {latestApplication.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5">

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-lg p-3 border border-white">
                    <p className="text-xs text-gray-500">Application ID</p>
                    <h4 className="text-sm font-bold mt-1 text-gray-800">
                      {latestApplication.application_id}
                    </h4>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-lg p-3 border border-white">
                    <p className="text-xs text-gray-500">Annual Income</p>
                    <h4 className="text-sm font-bold mt-1 text-gray-800">
                      Rs. {latestApplication.income_limit}
                    </h4>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-lg p-3 border border-white">
                    <p className="text-xs text-gray-500">Submitted On</p>
                    <h4 className="text-sm font-bold mt-1 text-gray-800">
                      {latestApplication.submitted_on
                        ? new Date(
                            latestApplication.submitted_on
                          ).toLocaleDateString()
                        : "N/A"}
                    </h4>
                  </div>
                </div>

                {latestApplication.next_step && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold mb-3 text-gray-700">
                      Next Step
                    </p>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "45%" }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      {latestApplication.next_step}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 bg-white/60 border border-violet-100 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-800">
                  No Applications Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Apply for a scheme to see status updates.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg"
                >
                  Apply Now
                </button>
              </div>
            )}
          </motion.div>

          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              User Profile
            </h2>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {userName}
                </h3>

                <p className="text-sm text-gray-500">
                  {userState}, India
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: "Email", value: user?.email },
                { label: "Role", value: user?.role },
                { label: "User ID", value: user?.userId },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gradient-to-br from-white to-violet-50 border border-violet-100 rounded-lg p-4 shadow-sm"
                >
                  <p className="text-xs text-gray-500">{item.label}</p>

                  <h3 className="text-sm font-semibold mt-1 capitalize text-gray-800">
                    {item.value || "N/A"}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommended Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-2xl p-6 mt-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Recommended Schemes
          </h2>

          <div className="space-y-4 mt-6">
            {recommendedSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-white/90 to-violet-50 border border-violet-100 shadow-md rounded-xl p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {scheme.category} • Income limit {scheme.incomeLimit}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-cyan-500">
                    {scheme.match}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: scheme.match }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${scheme.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Dashboard;