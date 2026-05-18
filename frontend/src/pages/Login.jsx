import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("govconnect_token", data.token);
      localStorage.setItem("govconnect_user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: "Easy Scheme Discovery",
      text: "Find government welfare schemes based on your profile, income, and eligibility.",
      color: "from-cyan-400 to-blue-600",
      bg: "from-cyan-50 to-blue-50",
      border: "border-cyan-200",
      icon: "🔍",
    },
    {
      title: "Paperless Applications",
      text: "Apply online without visiting offices. Upload documents securely.",
      color: "from-violet-400 to-fuchsia-600",
      bg: "from-violet-50 to-fuchsia-50",
      border: "border-violet-200",
      icon: "📋",
    },
    {
      title: "Real-Time Tracking",
      text: "Check application status, approval progress, and important notifications.",
      color: "from-emerald-400 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      icon: "📡",
    },
    {
      title: "Transparent Support",
      text: "Get clear information, helpline access, and verified government updates.",
      color: "from-amber-400 to-orange-500",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      icon: "🛡️",
    },
  ];

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

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">

        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[58%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Gov</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">Connect</span>
            </h1>
            <p className="text-gray-500 mt-2">Digital Governance Platform for Welfare Scheme Access</p>
          </div>

          <div className="mt-12 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight text-gray-800"
            >
              Connecting citizens with government benefits{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500">
                faster, simpler,
              </span>{" "}
              and more transparently.
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {benefits.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + index * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br ${item.bg} backdrop-blur-xl border ${item.border} rounded-xl p-5 shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className={`flex-1 h-1 rounded-full bg-gradient-to-r ${item.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-400 mt-10">
            <span>Government of India Initiative</span>
            <span>Secure Digital Access • 24/7 Citizen Support</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
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
            className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 rounded-2xl p-8 shadow-2xl shadow-violet-200/50"
          >
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 mb-7" />

            <div className="text-center mb-7">
              <motion.div
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                  loginType === "admin"
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-300"
                    : "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-200"
                }`}
              >
                <span className="text-white">{loginType === "admin" ? "A" : "G"}</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800">
                {loginType === "admin" ? "Admin Login" : "Citizen Login"}
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                {loginType === "admin"
                  ? "Manage schemes and verify applications."
                  : "Access your dashboard and benefit tracking."}
              </p>
            </div>

            {/* Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => { setLoginType("citizen"); setError(""); }}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  loginType === "citizen"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Citizen Login
              </button>
              <button
                type="button"
                onClick={() => { setLoginType("admin"); setError(""); }}
                className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Admin Login
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                  autoComplete="email"
                  className="w-full p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-800 placeholder:text-gray-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="current-password"
                  className="w-full p-3 rounded-xl bg-violet-50/60 border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-800 placeholder:text-gray-400 transition"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white ${
                  loginType === "admin"
                    ? "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:shadow-violet-300 hover:shadow-xl"
                    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:shadow-cyan-200 hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : loginType === "admin" ? (
                  "Login as Admin"
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>

            <div className="flex justify-between text-sm mt-5">
              <span className="text-cyan-500 hover:text-cyan-600 cursor-pointer transition font-medium">
                Forgot Password?
              </span>
              {loginType === "citizen" && (
                <span
                  onClick={() => navigate("/register")}
                  className="text-violet-500 hover:text-violet-600 cursor-pointer transition font-medium"
                >
                  Create Account
                </span>
              )}
            </div>

            <div className="mt-7 p-4 rounded-xl bg-gradient-to-r from-cyan-50 via-violet-50 to-fuchsia-50 border border-violet-100">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Your information is protected with secure, encrypted access.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
