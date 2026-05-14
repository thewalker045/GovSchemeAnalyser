import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";
import { getToken } from "../utils/auth";

function Home() {
  const navigate = useNavigate();

  const [selectedScheme, setSelectedScheme] = useState(null);

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // filter schemes
  useEffect(() => {
    const search = debouncedSearch.toLowerCase();

    const filtered = schemes.filter((scheme) => {
      return (
        (scheme.scheme_name || "")
          .toLowerCase()
          .includes(search) ||

        (scheme.category || "")
          .toLowerCase()
          .includes(search) ||

        (scheme.ministry || "")
          .toLowerCase()
          .includes(search)
      );
    });

    setFilteredSchemes(filtered);
  }, [debouncedSearch, schemes]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/schemes`);

      if (!response.ok) {
        throw new Error("Failed to fetch schemes");
      }

      const data = await response.json();

      console.log("API RESPONSE:", data);

      let schemesData = [];

      if (Array.isArray(data)) {
        schemesData = data;
      } else if (Array.isArray(data.schemes)) {
        schemesData = data.schemes;
      } else if (Array.isArray(data.data)) {
        schemesData = data.data;
      } else {
        schemesData = [];
      }

      setSchemes(schemesData);
      setFilteredSchemes(schemesData);

    } catch (err) {
      console.error("Fetch Error:", err);

      setError("Unable to load schemes");
      setSchemes([]);
      setFilteredSchemes([]);

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

    setFormData({
      fullName: "",
      phone: "",
      aadhaar: "",
      state: "",
    });

    setIncome("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = async (e) => {
    e.preventDefault();

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
          income: Number(income),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Application failed");
        return;
      }

      alert("Application submitted successfully");

      closeModal();

      navigate("/my-applications");

    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">
            Loading Schemes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50 relative overflow-hidden">

      {/* BLOBS */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-cyan-300/40 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-violet-300/40 blur-3xl rounded-full"></div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

          <div>
            <h1 className="text-5xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Gov
              </span>

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">
                Connect
              </span>
            </h1>

            <p className="mt-3 text-gray-500">
              Explore government schemes and apply online.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 flex-wrap">

            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
            >
              ← Dashboard
            </button>

            <button
              onClick={() => navigate("/my-applications")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
            >
              My Applications
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-10 max-w-4xl">

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/60">

            <div className="h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500"></div>

            <div className="flex items-center px-5 py-4">

              <span className="text-2xl">🔍</span>

              <input
                type="text"
                placeholder="Search schemes, ministry, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none ml-4 text-lg text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-10 text-center">
            <p className="text-red-500 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* SCHEMES */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.scheme_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-6 shadow-xl"
              >

                <p className="text-cyan-500 text-sm font-semibold">
                  {scheme.category || "Government Scheme"}
                </p>

                <h2 className="text-xl font-bold text-gray-800 mt-2">
                  {scheme.scheme_name}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {scheme.ministry || "Government of India"}
                </p>

                <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                  {scheme.benefit_description ||
                    "No description available"}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="bg-cyan-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">
                      Income Limit
                    </p>

                    <h3 className="font-bold text-gray-800 mt-1">
                      ₹
                      {Number(
                        scheme.income_limit || 0
                      ).toLocaleString()}
                    </h3>
                  </div>

                  <div className="bg-violet-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">
                      Processing
                    </p>

                    <h3 className="font-bold text-gray-800 mt-1">
                      {scheme.processing_days || "N/A"}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => openApply(scheme)}
                  className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg"
                >
                  Apply Now
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">

              <h2 className="text-3xl font-bold text-gray-800">
                No schemes found
              </h2>

              <p className="text-gray-500 mt-3">
                Check backend API or database data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  {selectedScheme.scheme_name}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Fill details and apply
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-2xl text-gray-400"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={submitApplication}
              className="space-y-4 mt-6"
            >

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="text"
                name="aadhaar"
                placeholder="Aadhaar Number"
                value={formData.aadhaar}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="number"
                placeholder="Annual Family Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;