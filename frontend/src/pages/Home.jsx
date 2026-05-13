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

  const defaultSchemes = [
    {
      scheme_id: "default-1",
      scheme_name: "PM Kisan Samman Nidhi",
      category: "Agriculture",
      ministry: "Ministry of Agriculture",
      benefit_description: "Financial support for eligible farmer families.",
      income_limit: 500000,
      processing_days: "15-20 days",
    },
    {
      scheme_id: "default-2",
      scheme_name: "Ayushman Bharat Yojana",
      category: "Healthcare",
      ministry: "Ministry of Health",
      benefit_description: "Health insurance support for eligible families.",
      income_limit: 300000,
      processing_days: "10-15 days",
    },
    {
      scheme_id: "default-3",
      scheme_name: "National Scholarship Scheme",
      category: "Education",
      ministry: "Ministry of Education",
      benefit_description: "Scholarship assistance for eligible students.",
      income_limit: 250000,
      processing_days: "20-30 days",
    },
    {
      scheme_id: "default-4",
      scheme_name: "Pradhan Mantri Awas Yojana",
      category: "Housing",
      ministry: "Ministry of Housing",
      benefit_description: "Housing support for economically weaker families.",
      income_limit: 600000,
      processing_days: "30-45 days",
    },
    {
      scheme_id: "default-5",
      scheme_name: "Ujjwala Yojana",
      category: "Women Welfare",
      ministry: "Ministry of Petroleum",
      benefit_description: "LPG connection support for eligible households.",
      income_limit: 300000,
      processing_days: "7-14 days",
    },
    {
      scheme_id: "default-6",
      scheme_name: "Sukanya Samriddhi Yojana",
      category: "Girl Child",
      ministry: "Ministry of Finance",
      benefit_description: "Savings support scheme for girl child education and future.",
      income_limit: 800000,
      processing_days: "5-10 days",
    },
    {
      scheme_id: "default-7",
      scheme_name: "PM Mudra Yojana",
      category: "Business",
      ministry: "Ministry of Finance",
      benefit_description: "Loan assistance for small businesses and entrepreneurs.",
      income_limit: 1000000,
      processing_days: "15-25 days",
    },
    {
      scheme_id: "default-8",
      scheme_name: "Atal Pension Yojana",
      category: "Pension",
      ministry: "Ministry of Finance",
      benefit_description: "Pension benefits for workers in the unorganized sector.",
      income_limit: 600000,
      processing_days: "7-12 days",
    },
    {
      scheme_id: "default-9",
      scheme_name: "PM Garib Kalyan Anna Yojana",
      category: "Food Security",
      ministry: "Ministry of Consumer Affairs",
      benefit_description: "Food grain support for eligible low-income families.",
      income_limit: 200000,
      processing_days: "5-10 days",
    },
    {
      scheme_id: "default-10",
      scheme_name: "Stand Up India Scheme",
      category: "Entrepreneurship",
      ministry: "Ministry of Finance",
      benefit_description: "Loan support for SC/ST and women entrepreneurs.",
      income_limit: 1200000,
      processing_days: "20-35 days",
    },
    {
      scheme_id: "default-11",
      scheme_name: "Digital India Internship Scheme",
      category: "Youth",
      ministry: "Ministry of Electronics and IT",
      benefit_description: "Internship opportunities for students in digital governance.",
      income_limit: 700000,
      processing_days: "15-20 days",
    },
    {
      scheme_id: "default-12",
      scheme_name: "Janani Suraksha Yojana",
      category: "Healthcare",
      ministry: "Ministry of Health",
      benefit_description: "Maternity assistance for eligible women.",
      income_limit: 250000,
      processing_days: "10-18 days",
    },
    {
      scheme_id: "default-13",
      scheme_name: "National Means-cum-Merit Scholarship",
      category: "Education",
      ministry: "Ministry of Education",
      benefit_description: "Scholarship support for meritorious students from low-income families.",
      income_limit: 350000,
      processing_days: "20-30 days",
    },
    {
      scheme_id: "default-14",
      scheme_name: "PM Fasal Bima Yojana",
      category: "Agriculture",
      ministry: "Ministry of Agriculture",
      benefit_description: "Crop insurance support for farmers.",
      income_limit: 600000,
      processing_days: "20-40 days",
    },
    {
      scheme_id: "default-15",
      scheme_name: "Skill India Mission",
      category: "Employment",
      ministry: "Ministry of Skill Development",
      benefit_description: "Skill training support for youth and job seekers.",
      income_limit: 500000,
      processing_days: "10-20 days",
    },
    {
      scheme_id: "default-16",
      scheme_name: "PM Vishwakarma Yojana",
      category: "Artisans",
      ministry: "Ministry of MSME",
      benefit_description: "Support for traditional artisans and craftspeople.",
      income_limit: 800000,
      processing_days: "15-25 days",
    },
    {
      scheme_id: "default-17",
      scheme_name: "Senior Citizen Savings Scheme",
      category: "Senior Citizens",
      ministry: "Ministry of Finance",
      benefit_description: "Savings and income support for senior citizens.",
      income_limit: 900000,
      processing_days: "5-10 days",
    },
    {
      scheme_id: "default-18",
      scheme_name: "Beti Bachao Beti Padhao",
      category: "Women Welfare",
      ministry: "Ministry of Women and Child Development",
      benefit_description: "Support for girl child education and welfare awareness.",
      income_limit: 500000,
      processing_days: "12-20 days",
    },
    {
      scheme_id: "default-19",
      scheme_name: "National Apprenticeship Promotion Scheme",
      category: "Employment",
      ministry: "Ministry of Skill Development",
      benefit_description: "Apprenticeship opportunities and training support.",
      income_limit: 700000,
      processing_days: "15-25 days",
    },
    {
      scheme_id: "default-20",
      scheme_name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
      category: "Rural Development",
      ministry: "Ministry of Rural Development",
      benefit_description: "Skill training and employment support for rural youth.",
      income_limit: 400000,
      processing_days: "20-30 days",
    },
  ];

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

  const displayedSchemes =
    schemes.length >= 20
      ? schemes
      : [
          ...schemes,
          ...defaultSchemes.filter(
            (defaultScheme) =>
              !schemes.some(
                (scheme) => scheme.scheme_name === defaultScheme.scheme_name
              )
          ),
        ].slice(0, 20);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-violet-50 text-gray-900">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="px-8 py-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white shadow-xl text-cyan-600 font-bold"
        >
          Loading schemes...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#67e8f9,_transparent_32%),radial-gradient(circle_at_bottom_right,_#f0abfc,_transparent_34%),linear-gradient(135deg,_#ecfeff,_#ffffff,_#f5f3ff,_#fff7ed)] text-gray-900 relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 90, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-140px] left-[-130px] w-96 h-96 bg-cyan-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 70, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-[-140px] right-[-130px] w-96 h-96 bg-fuchsia-400/35 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ x: [0, 55, 0], y: [0, -40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute top-[28%] right-[18%] w-80 h-80 bg-yellow-300/35 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-7">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl px-5 py-4 shadow-[0_18px_60px_rgba(14,165,233,0.14)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              G
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Gov
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-orange-400">
                  Connect
                </span>
              </h1>

              <p className="text-sm text-gray-500">Explore Government Schemes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white border border-cyan-100 text-cyan-700 font-bold hover:bg-cyan-50 hover:shadow-md transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/my-applications")}
              className="px-4 py-2 rounded-xl bg-white border border-violet-100 text-violet-700 font-bold hover:bg-violet-50 hover:shadow-md transition"
            >
              My Applications
            </button>

            <button
              onClick={() => alert("Customer care support will be available soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-bold hover:bg-emerald-50 hover:shadow-md transition"
            >
              Customer Care
            </button>

            <button
              onClick={() => alert("Chat feature coming soon.")}
              className="px-4 py-2 rounded-xl bg-white border border-orange-100 text-orange-700 font-bold hover:bg-orange-50 hover:shadow-md transition"
            >
              Chat
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("govconnect_token");
                localStorage.removeItem("govconnect_user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 font-bold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl p-7 sm:p-9 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_20px_70px_rgba(79,70,229,0.14)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 via-transparent to-fuchsia-100/60 pointer-events-none" />

          <div className="relative z-10">
            <p className="inline-block px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-sm font-bold">
              {displayedSchemes.length}+ schemes available
            </p>

            <h2 className="text-4xl sm:text-5xl font-black leading-tight mt-5 text-gray-950">
              Find the right government scheme and apply online with ease.
            </h2>

            <p className="text-gray-600 mt-4 max-w-3xl">
              Browse welfare schemes across healthcare, education, housing,
              agriculture, employment, business support and more.
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {displayedSchemes.map((scheme, index) => (
            <motion.div
              key={scheme.scheme_id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_14px_50px_rgba(14,165,233,0.12)] hover:shadow-[0_22px_70px_rgba(217,70,239,0.18)] transition overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/0 via-fuchsia-100/0 to-orange-100/0 group-hover:from-cyan-100/70 group-hover:via-fuchsia-50/60 group-hover:to-orange-100/60 transition pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <p className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-xs text-cyan-700 font-black">
                    {scheme.category}
                  </p>

                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-lg" />
                </div>

                <h2 className="text-xl font-black mt-5 text-gray-950">
                  {scheme.scheme_name}
                </h2>

                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {scheme.ministry}
                </p>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {scheme.benefit_description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-white/90 border border-cyan-100 rounded-2xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Income Limit</p>

                    <h3 className="text-sm font-black mt-1 text-gray-900">
                      Rs. {Number(scheme.income_limit).toLocaleString()}
                    </h3>
                  </div>

                  <div className="bg-white/90 border border-violet-100 rounded-2xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Processing</p>

                    <h3 className="text-sm font-black mt-1 text-gray-900">
                      {scheme.processing_days}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => openApply(scheme)}
                  className="w-full mt-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.03] transition"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white rounded-3xl p-6 shadow-[0_24px_80px_rgba(79,70,229,0.25)]"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-black text-cyan-600">
                  {selectedScheme.category}
                </p>

                <h2 className="text-2xl font-black text-gray-950 mt-1">
                  {selectedScheme.scheme_name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Fill details and submit your application.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 font-black transition"
              >
                X
              </button>
            </div>

            <form onSubmit={submitApplication} className="space-y-4 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 rounded-2xl bg-violet-50/70 border border-violet-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-300/50 transition"
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
                  className="w-full p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-300/50 transition"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/50 transition"
                />
              </div>

              <input
                type="number"
                placeholder="Annual Family Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full p-3.5 rounded-2xl bg-white border border-cyan-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.02] transition"
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
