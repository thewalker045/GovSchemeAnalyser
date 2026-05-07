import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registration Successful!");
    navigate("/login");
  };

  const features = [
    {
      title: "Verified Profile",
      text: "Save your basic details once and use them for future scheme applications.",
      color: "from-cyan-400 to-blue-600",
    },
    {
      title: "Faster Applications",
      text: "Apply quickly using your registered information and uploaded documents.",
      color: "from-purple-400 to-fuchsia-600",
    },
    {
      title: "Status Updates",
      text: "Receive updates about submitted applications, approvals, and required actions.",
      color: "from-emerald-400 to-teal-600",
    },
    {
      title: "Secure Access",
      text: "Your account gives you protected access to personal welfare services.",
      color: "from-amber-400 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <motion.div
        animate={{ x: [0, 70, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-purple-600/25 blur-3xl rounded-full"
      />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[52%] px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
              <span className="text-cyan-400">Gov</span>
              <span className="text-purple-400">Connect</span>
            </h1>

            <p className="text-gray-400 mt-2">
              Create your citizen account for digital welfare access
            </p>
          </div>

          <div className="mt-12 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold leading-tight"
            >
              Register once. Access multiple government schemes from one secure
              dashboard.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-gray-300 mt-6 leading-relaxed text-sm sm:text-base"
            >
              Your GovConnect account helps you discover eligible welfare
              schemes, submit applications, upload documents, track approvals,
              and receive important updates without visiting multiple offices or
              portals.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }}
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
                <p className="text-cyan-400 text-xl mb-2">Call</p>
                <h3 className="text-sm font-semibold">Call Support</h3>
                <p className="text-xs text-gray-400 mt-1">
                  +91 1800-123-4567
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <p className="text-purple-400 text-xl mb-2">Care</p>
                <h3 className="text-sm font-semibold">Customer Care</h3>
                <p className="text-xs text-gray-400 mt-1">
                  care@govconnect.in
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <p className="text-emerald-400 text-xl mb-2">Office</p>
                <h3 className="text-sm font-semibold">New Delhi Office</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Connaught Place, New Delhi - 110001
                </p>
              </motion.div>
            </div>
          </div>

          <div className="hidden lg:flex justify-between text-xs text-gray-500 mt-10">
            <span>Government of India Initiative</span>
            <span>Simple • Secure • Transparent</span>
          </div>
        </motion.div>

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
            className="w-full max-w-xl bg-[#0b1020]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-7">
              <motion.div
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20"
              >
                📝
              </motion.div>

              <h2 className="text-3xl font-bold">Citizen Registration</h2>

              <p className="text-gray-400 text-sm mt-2">
                Create your GovConnect account to apply for schemes and track
                benefits.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    placeholder="Enter Aadhaar number"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                >
                  <option value="">Select your state</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-purple-700/30 mt-2"
              >
                Create Citizen Account
              </motion.button>
            </form>

            <p className="text-sm text-center text-gray-400 mt-5">
              Already registered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-cyan-400 hover:text-purple-400 cursor-pointer font-semibold transition"
              >
                Login here
              </span>
            </p>

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Your details are used only for secure digital welfare services,
                eligibility matching, application tracking, and verified
                government communication.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
