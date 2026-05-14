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

  const userState =
    user?.state || latestApplication?.state || "India";

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
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-130px] left-[-130px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 70, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-[-140px] right-[-130px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full"
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
              <span className="text-cyan-400">{userName}</span>
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Your personalized government scheme dashboard.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Browse Schemes
            </button>

            <button
              onClick={() => navigate("/my-applications")}
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
            >
              My Applications
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 transition font-semibold"
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
              className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl"
            >
              <div
                className={`w-14 h-1 rounded-full bg-gradient-to-r ${item.color} mb-5`}
              />

              <p className="text-sm text-gray-400">{item.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>

              <p className="text-xs text-gray-500 mt-2">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Latest Application */}
        <div className="grid xl:grid-cols-[1.4fr_1fr] gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold">
              Latest Application
            </h2>

            {latestApplication ? (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-cyan-400 font-semibold">
                      {latestApplication.category}
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      {latestApplication.scheme_name}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      {latestApplication.ministry}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-cyan-400">
                    {latestApplication.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5">
                  <div className="bg-[#111827] rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-gray-400">
                      Application ID
                    </p>

                    <h4 className="text-sm font-bold mt-1">
                      {latestApplication.application_id}
                    </h4>
                  </div>

                  <div className="bg-[#111827] rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-gray-400">
                      Annual Income
                    </p>

                    <h4 className="text-sm font-bold mt-1">
                      Rs. {latestApplication.income_limit}
                    </h4>
                  </div>

                  <div className="bg-[#111827] rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-gray-400">
                      Submitted On
                    </p>

                    <h4 className="text-sm font-bold mt-1">
                      {new Date(
                        latestApplication.submitted_on
                      ).toLocaleDateString()}
                    </h4>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">
                    Next Step
                  </p>

                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    {latestApplication.next_step}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold">
                  No Applications Found
                </h3>

                <p className="text-gray-400 mt-2">
                  Apply for a scheme to see status updates.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-5 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
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
            className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold">User Profile</h2>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold">{userName}</h3>

                <p className="text-sm text-gray-400">
                  {userState}, India
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs text-gray-400">Email</p>

                <h3 className="text-sm font-semibold mt-1">
                  {user?.email}
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs text-gray-400">Role</p>

                <h3 className="text-sm font-semibold mt-1 capitalize">
                  {user?.role}
                </h3>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs text-gray-400">User ID</p>

                <h3 className="text-sm font-semibold mt-1">
                  {user?.userId}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommended Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 mt-8"
        >
          <h2 className="text-2xl font-bold">
            Recommended Schemes
          </h2>

          <div className="space-y-4 mt-6">
            {recommendedSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {scheme.category} • Income limit{" "}
                      {scheme.incomeLimit}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-cyan-400">
                    {scheme.match}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
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