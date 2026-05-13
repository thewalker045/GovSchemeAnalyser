import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";

function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loginType, setLoginType] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`login-otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`).focus();
    }
  };

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
        setError(data.message || "Login failed.");
        return;
      }

      setStep(2);
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter full OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
          purpose: "login",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed.");
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
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose: "login",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP.");
        return;
      }

      alert("OTP resent to " + email);
    } catch (err) {
      setError("Cannot connect to server.");
    }
  };

  const benefits = [
    {
      title: "Easy Scheme Discovery",
      text: "Find government welfare schemes based on your profile and eligibility.",
      color: "from-cyan-300 via-sky-400 to-blue-600",
    },
    {
      title: "Paperless Applications",
      text: "Apply online securely without visiting government offices.",
      color: "from-violet-400 via-fuchsia-500 to-pink-500",
    },
    {
      title: "Real-Time Tracking",
      text: "Track approvals, updates and notifications instantly.",
      color: "from-lime-300 via-emerald-400 to-teal-600",
    },
    {
      title: "Transparent Support",
      text: "Get verified government updates and citizen support.",
      color: "from-amber-300 via-orange-400 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#67e8f9,_transparent_32%),radial-gradient(circle_at_bottom_right,_#f0abfc,_transparent_34%),radial-gradient(circle_at_center,_#fde68a,_transparent_26%),linear-gradient(135deg,_#ecfeff,_#fff7ed,_#f5f3ff,_#eff6ff)] text-gray-900 overflow-hidden relative">
      
      {/* Animated Background Lights */}
      <motion.div
        animate={{ x: [0, 90, 0], y: [0, 45, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-400/45 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -70, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-pink-500/40 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.18, 1] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute top-[20%] right-[15%] w-72 h-72 bg-yellow-300/45 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 30, 0], scale: [1, 1.14, 1] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute bottom-[15%] left-[20%] w-80 h-80 bg-emerald-400/35 blur-3xl rounded-full"
      />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[58%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600">
                Gov
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400">
                Connect
              </span>
            </h1>

            <p className="text-gray-700 mt-2 text-lg font-medium">
              Digital Governance Platform for Welfare Scheme Access
            </p>
          </div>

          <div className="mt-12 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-black leading-tight text-gray-950"
            >
              Connecting citizens with government benefits faster,
              simpler, and more transparently.
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {benefits.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + index * 0.12 }}
                  whileHover={{ y: -12, scale: 1.04 }}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_12px_45px_rgba(14,165,233,0.12)] hover:shadow-[0_24px_70px_rgba(217,70,239,0.22)] transition-all duration-500"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-15 transition duration-500`}
                  />

                  <div
                    className={`w-16 h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-5 shadow-lg`}
                  />

                  <h3 className="font-bold text-xl mb-3 text-gray-950 relative z-10">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-600 mt-10 font-medium">
            <span>Government of India Initiative</span>
            <span>Secure Digital Access • 24/7 Citizen Support</span>
          </div>
        </motion.div>

        {/* RIGHT SECTION */}
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
            className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl border border-white/80 rounded-[32px] p-8 shadow-[0_20px_80px_rgba(79,70,229,0.18)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-fuchsia-100/30 to-orange-100/50 pointer-events-none" />

            <div className="relative z-10">
              
              {/* Top Bar */}
              <div className="flex justify-center mb-6">
                <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 shadow-lg" />
              </div>

              {step === 1 ? (
                <>
                  <div className="text-center mb-7">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl ${
                        loginType === "admin"
                          ? "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-white"
                          : "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white"
                      }`}
                    >
                      {loginType === "admin" ? "A" : "G"}
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-950">
                      {loginType === "admin" ? "Admin Login" : "Citizen Login"}
                    </h2>

                    <p className="text-gray-600 text-sm mt-2">
                      {loginType === "admin"
                        ? "Manage schemes and applications."
                        : "Access your dashboard and benefits."}
                    </p>
                  </div>

                  {/* TOGGLE */}
                  <div className="grid grid-cols-2 gap-2 mb-6 bg-white/80 p-1 rounded-2xl border border-cyan-100 shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginType("citizen");
                        setError("");
                      }}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        loginType === "citizen"
                          ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-400/30"
                          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-600"
                      }`}
                    >
                      Citizen Login
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginType("admin");
                        setError("");
                      }}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        loginType === "admin"
                          ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-400/30"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      Admin Login
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* LOGIN FORM */}
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        required
                        className="w-full p-3.5 rounded-2xl bg-white/95 border border-cyan-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-300/60 focus:border-cyan-500 text-gray-800 placeholder:text-gray-400 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        Password
                      </label>

                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        required
                        className="w-full p-3.5 rounded-2xl bg-white/95 border border-fuchsia-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-fuchsia-300/60 focus:border-fuchsia-500 text-gray-800 placeholder:text-gray-400 transition-all duration-300"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-white shadow-xl transition-all duration-300 disabled:opacity-60 ${
                        loginType === "admin"
                          ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 hover:shadow-[0_12px_35px_rgba(236,72,153,0.45)]"
                          : "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:shadow-[0_12px_35px_rgba(14,165,233,0.45)]"
                      }`}
                    >
                      {loading
                        ? "Sending OTP..."
                        : loginType === "admin"
                        ? "Continue as Admin"
                        : "Continue Securely"}
                    </motion.button>
                  </form>

                  <div className="flex justify-between text-sm mt-5 text-gray-500">
                    <span className="hover:text-cyan-600 cursor-pointer transition font-medium">
                      Forgot Password?
                    </span>

                    {loginType === "citizen" && (
                      <span
                        onClick={() => navigate("/register")}
                        className="hover:text-fuchsia-600 cursor-pointer transition font-medium"
                      >
                        Create Account
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* OTP SCREEN */}
                  <div className="text-center mb-7">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl shadow-xl"
                    >
                      🔐
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-950">
                      Verify OTP
                    </h2>

                    <p className="text-gray-600 text-sm mt-2">
                      OTP sent to{" "}
                      <span className="text-cyan-600 font-semibold">
                        {email}
                      </span>
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`login-otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-white/95 border border-cyan-100 text-gray-950 shadow-md focus:outline-none focus:ring-4 focus:ring-fuchsia-300/60 focus:border-fuchsia-500 transition-all duration-300"
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-white shadow-xl transition-all duration-300 disabled:opacity-60 ${
                        loginType === "admin"
                          ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 hover:shadow-[0_12px_35px_rgba(236,72,153,0.45)]"
                          : "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:shadow-[0_12px_35px_rgba(14,165,233,0.45)]"
                      }`}
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </motion.button>
                  </form>

                  <div className="flex justify-between mt-5 text-sm text-gray-500">
                    <span
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                      className="hover:text-cyan-600 cursor-pointer transition font-medium"
                    >
                      ← Change Email
                    </span>

                    <span
                      onClick={handleResendOtp}
                      className="hover:text-fuchsia-600 cursor-pointer transition font-medium"
                    >
                      Resend OTP
                    </span>
                  </div>
                </>
              )}

              {/* SECURITY FOOTER */}
              <div className="mt-7 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-fuchsia-50 to-orange-50 border border-cyan-100 shadow-sm">
                <p className="text-xs text-gray-600 leading-relaxed text-center">
                  Your information is protected with secure digital access
                  and OTP verification.
                </p>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
