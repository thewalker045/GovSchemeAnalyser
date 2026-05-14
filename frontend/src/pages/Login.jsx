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
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp, purpose: "login" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed.");
        return;
      }

      // Save token and user
      localStorage.setItem("govconnect_token", data.token);
      localStorage.setItem("govconnect_user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
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
        body: JSON.stringify({ email, purpose: "login" }),
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
    { title: "Easy Scheme Discovery", text: "Find government welfare schemes based on your profile, income, and eligibility.", color: "from-cyan-400 to-blue-600" },
    { title: "Paperless Applications", text: "Apply online without visiting offices. Upload documents securely.", color: "from-purple-400 to-fuchsia-600" },
    { title: "Real-Time Tracking", text: "Check application status, approval progress, and important notifications.", color: "from-emerald-400 to-teal-600" },
    { title: "Transparent Support", text: "Get clear information, helpline access, and verified government updates.", color: "from-amber-400 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <motion.div animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
      <motion.div animate={{ x: [0, -60, 0], y: [0, 70, 0] }} transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full" />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">

        {/* LEFT PANEL */}
        <motion.div initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="w-full lg:w-[58%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-cyan-400">Gov</span><span className="text-purple-400">Connect</span>
            </h1>
            <p className="text-gray-400 mt-2">Digital Governance Platform for Welfare Scheme Access</p>
          </div>

          <div className="mt-12 max-w-3xl">
            <motion.h2 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight">
              Connecting citizens with government benefits faster, simpler, and more transparently.
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {benefits.map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + index * 0.12 }} whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl">
                  <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${item.color} mb-4`} />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-500 mt-10">
            <span>Government of India Initiative</span>
            <span>Secure Digital Access • 24/7 Citizen Support</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="w-full lg:w-[42%] flex items-center justify-center px-6 py-10">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }}
            className="w-full max-w-md bg-[#0b1020]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

            {step === 1 ? (
              <>
                <div className="text-center mb-7">
                  <motion.div animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                      loginType === "admin"
                        ? "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-700/30"
                        : "bg-gradient-to-br from-cyan-400 to-purple-600 shadow-cyan-500/20"
                    }`}>
                    {loginType === "admin" ? "A" : "G"}
                  </motion.div>
                  <h2 className="text-3xl font-bold">{loginType === "admin" ? "Admin Login" : "Citizen Login"}</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {loginType === "admin" ? "Manage schemes and verify applications." : "Access your dashboard and benefit tracking."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6 bg-[#111827] p-1 rounded-lg border border-gray-700">
                  <button type="button" onClick={() => { setLoginType("citizen"); setError(""); }}
                    className={`py-2 rounded-md text-sm font-semibold transition ${
                      loginType === "citizen" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}>
                    Citizen Login
                  </button>
                  <button type="button" onClick={() => { setLoginType("admin"); setError(""); }}
                    className={`py-2 rounded-md text-sm font-semibold transition ${
                      loginType === "admin" ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white" : "text-gray-400 hover:text-white"
                    }`}>
                    Admin Login
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                    <input type="email" placeholder="Enter your registered email"
                      value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} required
                      className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Password</label>
                    <input type="password" placeholder="Enter your secure password"
                      value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} required
                      className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500" />
                  </div>

                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold shadow-lg disabled:opacity-60 ${
                      loginType === "admin"
                        ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600"
                        : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
                    }`}>
                    {loading ? "Sending OTP..." : loginType === "admin" ? "Continue as Admin" : "Continue Securely"}
                  </motion.button>
                </form>

                <div className="flex justify-between text-sm mt-5 text-gray-400">
                  <span className="hover:text-cyan-400 cursor-pointer transition">Forgot Password?</span>
                  {loginType === "citizen" && (
                    <span onClick={() => navigate("/register")} className="hover:text-purple-400 cursor-pointer transition">
                      Create Account
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-7">
                  <motion.div animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    🔐
                  </motion.div>
                  <h2 className="text-3xl font-bold">Verify OTP</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    A 6-digit OTP has been sent to{" "}
                    <span className="text-cyan-400">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input key={index} id={`login-otp-${index}`} type="text" maxLength={1}
                        value={digit} onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white" />
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold shadow-lg disabled:opacity-60 ${
                      loginType === "admin"
                        ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600"
                        : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
                    }`}>
                    {loading ? "Verifying..." : "Verify and Login"}
                  </motion.button>
                </form>

                <div className="flex justify-between mt-5 text-sm text-gray-400">
                  <span onClick={() => { setStep(1); setError(""); }} className="hover:text-cyan-400 cursor-pointer transition">
                    ← Change Email
                  </span>
                  <span onClick={handleResendOtp} className="hover:text-purple-400 cursor-pointer transition">
                    Resend OTP
                  </span>
                </div>
              </>
            )}

            <div className="mt-7 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Your information is protected with secure digital access and OTP verification.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;