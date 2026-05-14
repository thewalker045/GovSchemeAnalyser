import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaar: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          aadhaar: formData.aadhaar,
          state: formData.state,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
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
        body: JSON.stringify({
          email: formData.email,
          otp: enteredOtp,
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed.");
        return;
      }

      // Save token and user
      localStorage.setItem("govconnect_token", data.token);
      localStorage.setItem("govconnect_user", JSON.stringify(data.user));

      navigate("/login");
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
        body: JSON.stringify({ email: formData.email, purpose: "register" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP.");
        return;
      }
      alert("OTP resent to " + formData.email);
    } catch (err) {
      setError("Cannot connect to server.");
    }
  };

  const features = [
    { title: "Verified Profile", text: "Save your basic details once and use them for future scheme applications.", color: "from-cyan-400 to-blue-600" },
    { title: "Faster Applications", text: "Apply quickly using your registered information and uploaded documents.", color: "from-purple-400 to-fuchsia-600" },
    { title: "Status Updates", text: "Receive updates about submitted applications, approvals, and required actions.", color: "from-emerald-400 to-teal-600" },
    { title: "Secure Access", text: "Your account gives you protected access to personal welfare services.", color: "from-amber-400 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <motion.div animate={{ x: [0, 70, 0], y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
      <motion.div animate={{ x: [0, -70, 0], y: [0, 60, 0] }} transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full" />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">

        {/* LEFT PANEL */}
        <motion.div initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="w-full lg:w-[52%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-cyan-400">Gov</span><span className="text-purple-400">Connect</span>
            </h1>
            <p className="text-gray-400 mt-2">Create your citizen account for digital welfare access</p>
          </div>

          <div className="mt-12 max-w-2xl">
            <motion.h2 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight">
              Register once. Access multiple government schemes from one secure dashboard.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="text-gray-300 mt-6 leading-relaxed text-sm sm:text-base">
              Your GovConnect account helps you discover eligible welfare schemes, submit applications,
              upload documents, track approvals, and receive important updates.
            </motion.p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }} whileHover={{ y: -8, scale: 1.02 }}
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
            <span>Simple • Secure • Transparent</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="w-full lg:w-[48%] flex items-center justify-center px-6 py-10">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }}
            className="w-full max-w-xl bg-[#0b1020]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

            {step === 1 ? (
              <>
                <div className="text-center mb-7">
                  <motion.div animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    📝
                  </motion.div>
                  <h2 className="text-3xl font-bold">Citizen Registration</h2>
                  <p className="text-gray-400 text-sm mt-2">Create your GovConnect account to apply for schemes.</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                      <input type="text" name="fullName" placeholder="Enter full name"
                        value={formData.fullName} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                      <input type="email" name="email" placeholder="Enter email"
                        value={formData.email} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                      <input type="tel" name="phone" placeholder="Enter phone number"
                        value={formData.phone} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Aadhaar Number</label>
                      <input type="text" name="aadhaar" placeholder="Enter Aadhaar number"
                        value={formData.aadhaar} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">State</label>
                    <select name="state" value={formData.state} onChange={handleChange} required
                      className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white">
                      <option value="">Select your state</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                      <option>Uttar Pradesh</option>
                      <option>West Bengal</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Password</label>
                      <input type="password" name="password" placeholder="Create password"
                        value={formData.password} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                      <input type="password" name="confirmPassword" placeholder="Confirm password"
                        value={formData.confirmPassword} onChange={handleChange} required
                        className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500" />
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-lg mt-2 disabled:opacity-60">
                    {loading ? "Sending OTP..." : "Continue with OTP Verification"}
                  </motion.button>
                </form>

                <p className="text-sm text-center text-gray-400 mt-5">
                  Already registered?{" "}
                  <span onClick={() => navigate("/login")}
                    className="text-cyan-400 hover:text-purple-400 cursor-pointer font-semibold transition">
                    Login here
                  </span>
                </p>
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
                    <span className="text-cyan-400">{formData.email}</span>
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
                      <input key={index} id={`otp-${index}`} type="text" maxLength={1}
                        value={digit} onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white" />
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-lg disabled:opacity-60">
                    {loading ? "Verifying..." : "Verify and Register"}
                  </motion.button>
                </form>

                <div className="flex justify-between mt-5 text-sm text-gray-400">
                  <span onClick={() => setStep(1)} className="hover:text-cyan-400 cursor-pointer transition">
                    ← Change Email
                  </span>
                  <span onClick={handleResendOtp} className="hover:text-purple-400 cursor-pointer transition">
                    Resend OTP
                  </span>
                </div>
              </>
            )}

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Your details are used only for secure digital welfare services and verified government communication.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;