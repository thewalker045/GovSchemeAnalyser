import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logout, getUser, getToken } from "../utils/auth";
import API_URL from "../config";

function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

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
    navigate("/login");
  };

  const totalApplications = applications.length;

  const submittedApplications = applications.filter(
    (app) => app.status === "Submitted"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  const latestApplication = applications[0];

  const userName = user?.fullName || "Citizen User";

  const userState = user?.state || latestApplication?.state || "India";

  const recommendedSchemes = [
    {
      name: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      incomeLimit: "Rs. 5,00,000",
      match: "92%",
      color: "from-cyan-400 via-sky-500 to-blue-600",
    },
    {
      name: "Ayushman Bharat Yojana",
      category: "Healthcare",
      incomeLimit: "Rs. 3,00,000",
      match: "88%",
      color: "from-emerald-400 via-teal-500 to-cyan-600",
    },
    {
      name: "National Scholarship Scheme",
      category: "Education",
      incomeLimit: "Rs. 2,50,000",
      match: "81%",
      color: "from-violet-400 via-fuchsia-500 to-pink-500",
    },
  ];

  const quickActions = [
    {
      title: "Schemes",
      text: "Explore welfare schemes",
      action: () => navigate("/"),
      color: "from-cyan-400 to-blue-600",
      icon: "📋",
    },
    {
      title: "My Applications",
      text: "Track your submitted forms",
      action: () => navigate("/my-applications"),
      color: "from-violet-500 to-fuchsia-600",
      icon: "🗂️",
    },
    {
      title: "Customer Care",
      text: "Get citizen support",
      action: () => alert("Customer care support will be available soon."),
      color: "from-emerald-400 to-teal-600",
      icon: "🎧",
    },
    {
      title: "Chat Feature",
      text: "Ask questions instantly",
      action: () => alert("Chat feature coming soon."),
      color: "from-orange-400 to-pink-500",
      icon: "💬",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-violet-50 text-gray-900">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-8 py-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-xl text-cyan-600 font-semibold"
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#67e8f9,_transparent_32%),radial-gradient(circle_at_bottom_right,_#f0abfc,_transparent_34%),linear-gradient(135deg,_#ecfeff,_#ffffff,_#f5f3ff,_#fff7ed)] text-gray-900 relative overflow-hidden">
      {/* Background Lights */}
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
        {/* Top Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl px-5 py-4 shadow-[0_18px_60px_rgba(14,165,233,0.14)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              G
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Gov
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-orange-400">
                  Connect
                </span>
              </h1>

              <p className="text-sm text-gray-500">
                Citizen Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-100 text-sm font-bold text-gray-800 shadow-sm">
              [{userName}]
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-white border border-cyan-100 text-cyan-700 font-semibold hover:bg-cyan-50 hover:shadow-md transition"
            >
              Schemes
            </button>

            <button
              onClick={() => navigate("/my-applications")}
              className="px-4 py-2 rounded-xl bg-white border border-violet-100 text-violet-700 font-semibold hover:bg-violet-50 hover:shadow-md transition"
            >
              My Applications
            </button>

            <button
              onClick={() => alert("Customer care support will be available soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-50 hover:shadow-md transition"
            >
              Customer Care
            </button>

            <button
              onClick={() => alert("Chat feature coming soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-orange-100 text-orange-700 font-semibold hover:bg-orange-50 hover:shadow-md transition"
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
          className="mt-8 grid xl:grid-cols-[1.3fr_0.7fr] gap-6"
        >
          <div className="rounded-3xl p-7 sm:p-9 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_20px_70px_rgba(79,70,229,0.14)] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-transparent to-fuchsia-100/60 pointer-events-none" />

            <div className="relative z-10">
              <p className="inline-block px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-sm font-bold">
                Welcome back, {userName}
              </p>

              <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-5 text-gray-950">
                Manage your schemes, applications, support and updates in one place.
              </h2>

              <p className="text-gray-600 mt-4 max-w-2xl">
                Track government benefits, view application status, discover recommended schemes, and get help whenever needed.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.03] transition"
                >
                  Explore Schemes
                </button>

                <button
                  onClick={() => navigate("/my-applications")}
                  className="px-6 py-3 rounded-2xl bg-white border border-violet-100 text-violet-700 font-bold hover:bg-violet-50 hover:scale-[1.03] transition"
                >
                  View Applications
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-7 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_70px_rgba(14,165,233,0.12)]">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-white flex items-center justify-center text-4xl font-black shadow-xl">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-xl font-black">{userName}</h3>
                <p className="text-gray-500 text-sm">{userState}, India</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100">
                <p className="text-xs text-gray-500">Email</p>
                <h4 className="font-bold text-gray-800 mt-1">{user?.email}</h4>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                <p className="text-xs text-gray-500">Role</p>
                <h4 className="font-bold text-gray-800 mt-1 capitalize">
                  {user?.role}
                </h4>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          {quickActions.map((item, index) => (
            <motion.button
              key={item.title}
              onClick={item.action}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-left bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_14px_50px_rgba(14,165,233,0.12)] hover:shadow-[0_22px_70px_rgba(217,70,239,0.18)] transition overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 hover:opacity-10 transition`}
              />

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-2xl shadow-lg relative z-10`}
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-black mt-5 relative z-10">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2 relative z-10">
                {item.text}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
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
              color: "from-violet-400 to-fuchsia-600",
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
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -7 }}
              className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_14px_50px_rgba(79,70,229,0.12)]"
            >
              <div
                className={`w-16 h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-5 shadow-md`}
              />

              <p className="text-sm text-gray-500 font-semibold">
                {item.title}
              </p>

              <h2 className="text-3xl font-black mt-2 text-gray-950">
                {item.value}
              </h2>

              <p className="text-xs text-gray-500 mt-2">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid xl:grid-cols-[1.35fr_0.65fr] gap-6 mt-8">
          {/* Latest Application */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_18px_60px_rgba(14,165,233,0.12)]"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-black text-gray-950">
                  Latest Application
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Track your most recent scheme request.
                </p>
              </div>

              <button
                onClick={() => navigate("/my-applications")}
                className="px-5 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 font-bold hover:bg-violet-100 transition"
              >
                View All
              </button>
            </div>

            {latestApplication ? (
              <div className="mt-6 bg-gradient-to-br from-cyan-50 via-white to-violet-50 border border-cyan-100 rounded-3xl p-5">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-cyan-600 font-bold">
                      {latestApplication.category}
                    </p>

                    <h3 className="text-xl font-black mt-2 text-gray-950">
                      {latestApplication.scheme_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {latestApplication.ministry}
                    </p>
                  </div>

                  <span className="h-fit px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-black">
                    {latestApplication.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5">
                  <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm">
                    <p className="text-xs text-gray-500">Application ID</p>
                    <h4 className="text-sm font-black mt-1">
                      {latestApplication.application_id}
                    </h4>
                  </div>

                  <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm">
                    <p className="text-xs text-gray-500">Annual Income</p>
                    <h4 className="text-sm font-black mt-1">
                      Rs. {latestApplication.income_limit}
                    </h4>
                  </div>

                  <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm">
                    <p className="text-xs text-gray-500">Submitted On</p>
                    <h4 className="text-sm font-black mt-1">
                      {new Date(
                        latestApplication.submitted_on
                      ).toLocaleDateString()}
                    </h4>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-black mb-3">Next Step</p>

                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-cyan-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    {latestApplication.next_step}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-gradient-to-br from-cyan-50 via-white to-violet-50 border border-cyan-100 rounded-3xl p-8 text-center">
                <h3 className="text-xl font-black text-gray-950">
                  No Applications Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Apply for a scheme to see status updates here.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white font-bold shadow-lg hover:scale-[1.03] transition"
                >
                  Apply Now
                </button>
              </div>
            )}
          </motion.div>

          {/* Support Box */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_18px_60px_rgba(217,70,239,0.12)]"
          >
            <h2 className="text-2xl font-black text-gray-950">
              Help & Support
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Need help with applications or eligibility?
            </p>

            <div className="space-y-4 mt-6">
              <button
                onClick={() => alert("Chat feature coming soon.")}
                className="w-full p-4 rounded-2xl bg-cyan-50 border border-cyan-100 text-left hover:bg-cyan-100 transition"
              >
                <h3 className="font-black text-cyan-700">Chat with Support</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ask questions about schemes and status.
                </p>
              </button>

              <button
                onClick={() => alert("Customer care support will be available soon.")}
                className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-left hover:bg-emerald-100 transition"
              >
                <h3 className="font-black text-emerald-700">Customer Care</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Get assistance from support team.
                </p>
              </button>

              <button
                onClick={() => navigate("/my-applications")}
                className="w-full p-4 rounded-2xl bg-violet-50 border border-violet-100 text-left hover:bg-violet-100 transition"
              >
                <h3 className="font-black text-violet-700">Application Help</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Review submitted applications.
                </p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recommended Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 mt-8 shadow-[0_18px_60px_rgba(79,70,229,0.12)]"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-black text-gray-950">
                Recommended Schemes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Schemes that may match your profile.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 font-bold hover:bg-cyan-100 transition"
            >
              Browse More
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {recommendedSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-white via-cyan-50/60 to-violet-50/60 border border-white rounded-3xl p-5 shadow-sm"
              >
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-black text-gray-950">
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {scheme.category} • Income limit {scheme.incomeLimit}
                    </p>
                  </div>

                  <span className="text-sm font-black text-cyan-600">
                    {scheme.match} Match
                  </span>
                </div>

                <div className="w-full h-2.5 bg-white rounded-full mt-4 overflow-hidden border border-cyan-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: scheme.match }}
                    transition={{ duration: 1 }}
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
