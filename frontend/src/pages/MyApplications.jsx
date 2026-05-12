import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";
import { getToken } from "../utils/auth";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
    if (status === "Approved") return "text-emerald-400";
    if (status === "Rejected") return "text-red-400";
    return "text-cyan-400";
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 70, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-[-140px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              <span className="text-cyan-400">My</span>{" "}
              <span className="text-purple-400">Applications</span>
            </h1>
            <p className="text-gray-400 mt-3">
              Track your submitted scheme applications and verification status.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
          >
            Browse Schemes
          </button>
        </motion.div>

        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-[#0b1020]/90 border border-white/10 rounded-2xl p-10 text-center"
          >
            <h2 className="text-2xl font-bold">No Applications Yet</h2>
            <p className="text-gray-400 mt-3">
              You have not applied for any scheme. Browse schemes and submit
              your first application.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
            >
              Apply for Scheme
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 mt-10">
            {applications.map((app, index) => (
              <motion.div
                key={app.application_id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-cyan-400 font-semibold">
                      {app.category}
                    </p>
                    <h2 className="text-xl font-bold mt-2">
                      {app.scheme_name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {app.ministry}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-bold ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-5">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Application ID</p>
                    <h3 className="text-sm font-bold mt-1">GC-{app.application_id}</h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Submitted On</p>
                    <h3 className="text-sm font-bold mt-1">
                      {new Date(app.submitted_on).toLocaleDateString()}
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Applicant</p>
                    <h3 className="text-sm font-bold mt-1">
                      {app.applicant_name}
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Annual Income</p>
                    <h3 className="text-sm font-bold mt-1">
                      Rs. {app.income}
                    </h3>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold mb-4">
                    Application Progress
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-400 mt-1" />
                      <div>
                        <h4 className="text-sm font-semibold">
                          Application Submitted
                        </h4>
                        <p className="text-xs text-gray-400">
                          Your application has been received.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-cyan-400 mt-1" />
                      <div>
                        <h4 className="text-sm font-semibold">
                          Document Verification
                        </h4>
                        <p className="text-xs text-gray-400">
                          {app.nextStep}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-60">
                      <div className="w-4 h-4 rounded-full bg-gray-600 mt-1" />
                      <div>
                        <h4 className="text-sm font-semibold">
                          Final Approval
                        </h4>
                        <p className="text-xs text-gray-400">
                          Awaiting officer review.
                        </p>
                      </div>
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
