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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
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

        headers: {
          "Content-Type": "application/json",
        },

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

        headers: {
          "Content-Type": "application/json",
        },

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
      localStorage.setItem(
        "govconnect_user",
        JSON.stringify(data.user)
      );

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

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: formData.email,
          purpose: "register",
        }),
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
      color: "from-cyan-400 to-blue-600",
      bg: "from-cyan-50 to-blue-50",
      border: "border-cyan-200",
      icon: "🛡️",
    },

    {
      title: "Faster Applications",
      text: "Apply quickly using your registered information and uploaded documents.",
      color: "from-violet-400 to-fuchsia-600",
      bg: "from-violet-50 to-fuchsia-50",
      border: "border-violet-200",
      icon: "⚡",
    },

    {
      title: "Status Updates",
      text: "Receive updates about submitted applications and approvals.",
      color: "from-emerald-400 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      icon: "📡",
    },

    {
      title: "Secure Access",
      text: "Protected access to welfare services with OTP verification.",
      color: "from-amber-400 to-orange-600",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      icon: "🔐",
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
          className="w-full lg:w-[55%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Gov
              </span>

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">
                Connect
              </span>
            </h1>

            <p className="text-gray-500 mt-2">
              Create your citizen account for digital welfare access
            </p>
          </div>

          <div className="mt-12 max-w-3xl">

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight text-gray-800"
            >
              Register once. Access multiple government schemes from one{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500">
                secure dashboard.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-gray-500 mt-6 leading-relaxed text-sm sm:text-base"
            >
              Your GovConnect account helps you discover eligible welfare schemes,
              submit applications, upload documents, track approvals, and receive updates.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">

              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br ${item.bg} backdrop-blur-xl border ${item.border} rounded-xl p-5 shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {item.icon}
                    </span>

                    <div
                      className={`flex-1 h-1 rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-400 mt-10">
            <span>Government of India Initiative</span>
            <span>Simple • Secure • Transparent</span>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[45%] flex items-center justify-center px-6 py-10"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="w-full max-w-xl bg-white/80 backdrop-blur-2xl border border-white/60 rounded-2xl p-8 shadow-2xl shadow-violet-200/50"
          >

            {/* Accent Bar */}
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 mb-7" />

            {step === 1 ? (
              <>
                {/* Header */}
                <div className="text-center mb-7">

                  <motion.div
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-200"
                  >
                    📝
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    Citizen Registration
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    Create your GovConnect account to apply for schemes.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* FORM */}
                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >

                  <div className="grid sm:grid-cols-2 gap-4">

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-violet-50/60 border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-800"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800"
                    />

                    <input
                      type="text"
                      name="aadhaar"
                      placeholder="Aadhaar Number"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-violet-50/60 border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-800"
                    />
                  </div>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800"
                  >
                    <option value="">
                      Select your state
                    </option>

                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Gujarat</option>
                    <option>Rajasthan</option>
                    <option>Uttar Pradesh</option>
                    <option>West Bengal</option>
                  </select>

                  <div className="grid sm:grid-cols-2 gap-4">

                    <input
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800"
                    />

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-xl bg-violet-50/60 border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-800"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 shadow-lg hover:shadow-cyan-200 transition-all text-white disabled:opacity-60"
                  >
                    {loading
                      ? "Sending OTP..."
                      : "Continue with OTP Verification"}
                  </motion.button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-5">
                  Already registered?{" "}

                  <span
                    onClick={() => navigate("/login")}
                    className="text-cyan-500 hover:text-violet-500 cursor-pointer font-semibold transition"
                  >
                    Login here
                  </span>
                </p>
              </>
            ) : (
              <>
                {/* OTP */}
                <div className="text-center mb-7">

                  <motion.div
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-200"
                  >
                    🔐
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    Verify OTP
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    A 6-digit OTP has been sent to{" "}

                    <span className="text-cyan-500">
                      {formData.email}
                    </span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
                >

                  <div className="flex justify-center gap-3">

                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(
                            e,
                            index
                          )
                        }
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800 ${
                          digit
                            ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 shadow-lg hover:shadow-cyan-200 transition-all text-white disabled:opacity-60"
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify and Register"}
                  </motion.button>
                </form>

                <div className="flex justify-between mt-5 text-sm text-gray-500">

                  <span
                    onClick={() => setStep(1)}
                    className="hover:text-cyan-500 cursor-pointer transition"
                  >
                    ← Change Email
                  </span>

                  <span
                    onClick={handleResendOtp}
                    className="hover:text-violet-500 cursor-pointer transition"
                  >
                    Resend OTP
                  </span>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-7 p-4 rounded-xl bg-gradient-to-r from-cyan-50 via-violet-50 to-fuchsia-50 border border-violet-100">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Your details are protected with secure digital access and OTP verification.
              </p>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;