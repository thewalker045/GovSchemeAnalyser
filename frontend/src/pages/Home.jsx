import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";
import { getToken } from "../utils/auth";

function Home() {
  const navigate = useNavigate();

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    aadhaar: "",
    state: "",
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/schemes`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSchemes(data);
      } else {
        setSchemes([]);
      }

    } catch (err) {
      console.error("Failed to fetch schemes:", err);
      setSchemes([]);

    } finally {
      setLoading(false);
    }
  };

  const openApply = (scheme) => {
    setSelectedScheme(scheme);
    setIncome("");
  };

  const closeModal = () => {
    setSelectedScheme(null);
    setIncome("");

    setFormData({
      fullName: "",
      phone: "",
      aadhaar: "",
      state: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    const yearlyIncome = Number(income);

    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },

        body: JSON.stringify({
          schemeId: selectedScheme.scheme_id,
          applicantName: formData.fullName,
          phone: formData.phone,
          aadhaar: formData.aadhaar,
          state: formData.state,
          income: yearlyIncome,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Application failed");
        return;
      }

      alert("Application submitted successfully!");

      closeModal();

      navigate("/my-applications");

    } catch (err) {
      console.error("Submit application error:", err);
      alert("Server error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading schemes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* Background Blobs */}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              <span className="text-cyan-400">Gov</span>
              <span className="text-purple-400">Connect</span>
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Explore government schemes and apply online.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/my-applications")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
            >
              My Applications
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 font-semibold transition"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Schemes */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.scheme_id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl"
            >
              {/* Category */}
              <p className="text-xs text-cyan-400 font-semibold">
                {scheme.category}
              </p>

              {/* Name */}
              <h2 className="text-xl font-bold mt-2">
                {scheme.scheme_name}
              </h2>

              {/* Ministry */}
              <p className="text-sm text-gray-400 mt-2">
                {scheme.ministry}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-300 mt-4">
                {scheme.benefit_description}
              </p>

              {/* Income + Processing */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    Income Limit
                  </p>

                  <h3 className="text-sm font-bold mt-1">
                    Rs.{" "}
                    {Number(
                      scheme.income_limit
                    ).toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    Processing
                  </p>

                  <h3 className="text-sm font-bold mt-1">
                    {scheme.processing_days}
                  </h3>
                </div>
              </div>

              {/* Apply */}
              <button
                onClick={() => openApply(scheme)}
                className="w-full mt-5 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-[#0b1020] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedScheme.scheme_name}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Fill details and apply.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={submitApplication}
              className="space-y-4 mt-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="Aadhaar Number"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700"
                />
              </div>

              <input
                type="number"
                placeholder="Annual Family Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600"
              >
                Submit Application
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;