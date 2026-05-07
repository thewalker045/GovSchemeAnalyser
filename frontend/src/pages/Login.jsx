import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("citizen");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loginType === "admin") {
      alert("Admin Login Successful!");
      navigate("/admin-dashboard");
    } else {
      alert("Citizen Login Successful!");
      navigate("/dashboard");

    }
  };

  const benefits = [
    {
      title: "Easy Scheme Discovery",
      text: "Find government welfare schemes based on your profile, income, category, location, and eligibility.",
      color: "from-cyan-400 to-blue-600",
    },
    {
      title: "Paperless Applications",
      text: "Apply online without visiting offices. Upload documents securely and track every step digitally.",
      color: "from-purple-400 to-fuchsia-600",
    },
    {
      title: "Real-Time Tracking",
      text: "Check application status, approval progress, benefit release updates, and important notifications.",
      color: "from-emerald-400 to-teal-600",
    },
    {
      title: "Transparent Support",
      text: "Get clear information, helpline access, grievance support, and verified government updates in one place.",
      color: "from-amber-400 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 70, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full"
      />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[58%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-cyan-400">Gov</span>
              <span className="text-purple-400">Connect</span>
            </h1>

            <p className="text-gray-400 mt-2">
              Digital Governance Platform for Welfare Scheme Access
            </p>
          </div>

          <div className="mt-12 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight"
            >
              Connecting citizens with government benefits faster, simpler, and
              more transparently.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-gray-300 mt-6 leading-relaxed text-sm sm:text-base"
            >
              GovConnect helps citizens discover, apply for, and track welfare
              schemes from one secure digital platform. Users can view eligible
              schemes, submit applications, upload documents, receive updates,
              and monitor approvals through a single dashboard.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + index * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl"
                >
                  <div
                    className={`w-12 h-1 rounded-full bg-gradient-to-r ${item.color} mb-4`}
                  />

                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <p className="text-cyan-400 text-xl font-bold mb-2">Call</p>
                <h3 className="text-sm font-semibold">Call Support</h3>
                <p className="text-xs text-gray-400 mt-1">
                  +91 1800-123-4567
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <p className="text-purple-400 text-xl font-bold mb-2">Care</p>
                <h3 className="text-sm font-semibold">Customer Care</h3>
                <p className="text-xs text-gray-400 mt-1">
                  care@govconnect.in
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <p className="text-emerald-400 text-xl font-bold mb-2">
                  Office
                </p>
                <h3 className="text-sm font-semibold">New Delhi Office</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Connaught Place, New Delhi - 110001
                </p>
              </motion.div>
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-500 mt-10">
            <span>Government of India Initiative</span>
            <span>Secure Digital Access • 24/7 Citizen Support</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[42%] flex items-center justify-center px-6 py-10"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="w-full max-w-md bg-[#0b1020]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-7">
              <motion.div
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                  loginType === "admin"
                    ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-700/30"
                    : "bg-gradient-to-br from-cyan-400 to-purple-600 shadow-cyan-500/20"
                }`}
              >
                {loginType === "admin" ? "A" : "G"}
              </motion.div>

              <h2 className="text-3xl font-bold">
                {loginType === "admin" ? "Admin Login" : "Citizen Login"}
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                {loginType === "admin"
                  ? "Manage schemes, verify applications, monitor citizens, and update welfare services."
                  : "Access your dashboard, applications, scheme updates, and benefit tracking."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 bg-[#111827] p-1 rounded-lg border border-gray-700">
              <button
                type="button"
                onClick={() => setLoginType("citizen")}
                className={`py-2 rounded-md text-sm font-semibold transition ${
                  loginType === "citizen"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Citizen Login
              </button>

              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`py-2 rounded-md text-sm font-semibold transition ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  {loginType === "admin" ? "Admin Email" : "Email Address"}
                </label>

                <input
                  type="email"
                  placeholder={
                    loginType === "admin"
                      ? "Enter official admin email"
                      : "Enter your registered email"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder={
                    loginType === "admin"
                      ? "Enter admin password"
                      : "Enter your secure password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold shadow-lg ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 shadow-purple-700/30"
                    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-purple-700/30"
                }`}
              >
                {loginType === "admin" ? "Login as Admin" : "Login Securely"}
              </motion.button>
            </form>

            <div className="flex justify-between text-sm mt-5 text-gray-400">
              <span className="hover:text-cyan-400 cursor-pointer transition">
                Forgot Password?
              </span>

              {loginType === "citizen" ? (
                <span
                  className="hover:text-purple-400 cursor-pointer transition"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </span>
              ) : (
                <span className="hover:text-purple-400 cursor-pointer transition">
                  Authorized Access Only
                </span>
              )}
            </div>

            <div className="mt-7 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                {loginType === "admin"
                  ? "Admin access is restricted to authorized government officers. Manage applications, approve documents, review scheme data, and support citizen service delivery securely."
                  : "Your information is protected with secure digital access. Use GovConnect to manage applications, upload documents, receive alerts, and stay connected with verified welfare services."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
