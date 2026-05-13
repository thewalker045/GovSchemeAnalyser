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
    {
      title: "Verified Profile",
      text: "Save your basic details once and use them for future scheme applications.",
      color: "from-cyan-400 via-sky-500 to-blue-600",
    },
    {
      title: "Faster Applications",
      text: "Apply quickly using your registered information and uploaded documents.",
      color: "from-violet-400 via-fuchsia-500 to-pink-500",
    },
    {
      title: "Status Updates",
      text: "Receive updates about submitted applications, approvals, and required actions.",
      color: "from-emerald-400 via-teal-500 to-cyan-600",
    },
    {
      title: "Secure Access",
      text: "Your account gives you protected access to personal welfare services.",
      color: "from-amber-400 via-orange-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#67e8f9,_transparent_32%),radial-gradient(circle_at_bottom_right,_#f0abfc,_transparent_34%),radial-gradient(circle_at_center,_#fde68a,_transparent_25%),linear-gradient(135deg,_#ecfeff,_#ffffff,_#f5f3ff,_#fff7ed)] text-gray-900 overflow-hidden relative">
      <motion.div
        animate={{ x: [0, 90, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-130px] left-[-130px] w-96 h-96 bg-cyan-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 70, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-130px] right-[-130px] w-96 h-96 bg-fuchsia-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -35, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[24%] right-[16%] w-80 h-80 bg-yellow-300/35 blur-3xl rounded-full"
      />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[52%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600">
                Gov
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400">
                Connect
              </span>
            </h1>

            <p className="text-gray-600 mt-2 text-lg font-medium">
              Create your citizen account for digital welfare access
            </p>
          </div>

          <div className="mt-12 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-black leading-tight text-gray-950"
            >
              Register once. Access multiple government schemes from one secure
              dashboard.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-gray-600 mt-6 leading-relaxed text-sm sm:text-base"
            >
              Your GovConnect account helps you discover eligible welfare
              schemes, submit applications, upload documents, track approvals,
              and receive important updates.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-5 shadow-[0_14px_50px_rgba(14,165,233,0.12)] hover:shadow-[0_22px_70px_rgba(217,70,239,0.18)] transition overflow-hidden relative"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition pointer-events-none`}
                  />

                  <div
                    className={`w-14 h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-4 shadow-md`}
                  />

                  <h3 className="font-black text-lg mb-2 text-gray-950 relative z-10">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-500 mt-10 font-medium">
            <span>Government of India Initiative</span>
            <span>Simple • Secure • Transparent</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[48%] flex items-center justify-center px-6 py-10"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-[32px] p-8 shadow-[0_20px_80px_rgba(79,70,229,0.18)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-fuchsia-100/30 to-orange-100/50 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 shadow-lg" />
              </div>

              {step === 1 ? (
                <>
                  <div className="text-center mb-7">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 flex items-center justify-center text-3xl shadow-xl"
                    >
                      📝
                    </motion.div>

                    <h2 className="text-3xl font-black text-gray-950">
                      Citizen Registration
                    </h2>

                    <p className="text-gray-600 text-sm mt-2">
                      Create your GovConnect account to apply for schemes.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="fullName"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 focus:border-cyan-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 focus:border-cyan-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-300/50 focus:border-violet-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Aadhaar Number
                        </label>

                        <input
                          type="text"
                          name="aadhaar"
                          placeholder="Enter Aadhaar number"
                          value={formData.aadhaar}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-300/50 focus:border-violet-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        State
                      </label>

                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-2xl bg-white/95 border border-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 focus:border-cyan-500 text-gray-900 transition"
                      >
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
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Password
                        </label>

                        <input
                          type="password"
                          name="password"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-fuchsia-100 focus:outline-none focus:ring-4 focus:ring-fuchsia-300/50 focus:border-fuchsia-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          Confirm Password
                        </label>

                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full p-3 rounded-2xl bg-white/95 border border-fuchsia-100 focus:outline-none focus:ring-4 focus:ring-fuchsia-300/50 focus:border-fuchsia-500 text-gray-900 placeholder:text-gray-400 transition"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-lg hover:shadow-cyan-400/40 transition disabled:opacity-60"
                    >
                      {loading
                        ? "Sending OTP..."
                        : "Continue with OTP Verification"}
                    </motion.button>
                  </form>

                  <p className="text-sm text-center text-gray-600 mt-5">
                    Already registered?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-cyan-600 hover:text-fuchsia-600 cursor-pointer font-bold transition"
                    >
                      Login here
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center mb-7">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl shadow-xl"
                    >
                      🔐
                    </motion.div>

                    <h2 className="text-3xl font-black text-gray-950">
                      Verify OTP
                    </h2>

                    <p className="text-gray-600 text-sm mt-2">
                      A 6-digit OTP has been sent to{" "}
                      <span className="text-cyan-600 font-bold">
                        {formData.email}
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
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="w-12 h-14 text-center text-xl font-black rounded-2xl bg-white/95 border border-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 focus:border-cyan-500 text-gray-950 shadow-md transition"
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-lg hover:shadow-cyan-400/40 transition disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify and Register"}
                    </motion.button>
                  </form>

                  <div className="flex justify-between mt-5 text-sm text-gray-500">
                    <span
                      onClick={() => setStep(1)}
                      className="hover:text-cyan-600 cursor-pointer transition font-bold"
                    >
                      ← Change Email
                    </span>

                    <span
                      onClick={handleResendOtp}
                      className="hover:text-fuchsia-600 cursor-pointer transition font-bold"
                    >
                      Resend OTP
                    </span>
                  </div>
                </>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-fuchsia-50 to-orange-50 border border-cyan-100 shadow-sm">
                <p className="text-xs text-gray-600 leading-relaxed text-center">
                  Your details are used only for secure digital welfare services
                  and verified government communication.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
