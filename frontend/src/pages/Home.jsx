import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [income, setIncome] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    aadhaar: "",
    state: "",
  });

  const schemes = [
    {
      id: 1,
      name: "PM Scholarship Support",
      ministry: "Ministry of Education",
      category: "Education",
      benefit: "Financial support up to Rs. 25,000 for eligible students.",
      incomeLimit: 250000,
      documents: ["Aadhaar Card", "Income Certificate", "Student ID"],
      deadline: "30 June 2026",
      processing: "7 to 15 days",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: 2,
      name: "Ayushman Bharat Health Card",
      ministry: "Ministry of Health",
      category: "Healthcare",
      benefit: "Health insurance support for eligible families.",
      incomeLimit: 300000,
      documents: ["Aadhaar Card", "Ration Card", "Address Proof"],
      deadline: "Open all year",
      processing: "5 to 10 days",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 3,
      name: "Housing Assistance Scheme",
      ministry: "Ministry of Housing",
      category: "Housing",
      benefit: "Housing support for low-income families.",
      incomeLimit: 200000,
      documents: ["Aadhaar Card", "Income Certificate", "Residence Proof"],
      deadline: "15 August 2026",
      processing: "15 to 30 days",
      color: "from-purple-500 to-fuchsia-600",
    },
    {
      id: 4,
      name: "Digital Skill Development",
      ministry: "Skill India Mission",
      category: "Employment",
      benefit: "Free digital training and job assistance.",
      incomeLimit: 500000,
      documents: ["Aadhaar Card", "Education Certificate"],
      deadline: "Open all year",
      processing: "3 to 7 days",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 5,
      name: "Women Entrepreneurship Grant",
      ministry: "Ministry of Women and Child Development",
      category: "Business",
      benefit: "Startup assistance for women entrepreneurs.",
      incomeLimit: 400000,
      documents: ["Aadhaar Card", "Business Plan", "Bank Details"],
      deadline: "20 September 2026",
      processing: "20 to 35 days",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: 6,
      name: "Senior Citizen Pension",
      ministry: "Social Welfare Department",
      category: "Pension",
      benefit: "Monthly pension support for eligible senior citizens.",
      incomeLimit: 180000,
      documents: ["Aadhaar Card", "Age Proof", "Income Certificate"],
      deadline: "Open all year",
      processing: "10 to 20 days",
      color: "from-indigo-500 to-violet-600",
    },
  ];

  const openApply = (scheme) => {
    setSelectedScheme(scheme);
    setIncome("");
  };

  const closeModal = () => {
    setSelectedScheme(null);
    setIncome("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = (e) => {
    e.preventDefault();

    const yearlyIncome = Number(income);

    if (yearlyIncome > selectedScheme.incomeLimit) {
      alert(
        `Not Eligible! Your income is above the eligibility limit of Rs. ${selectedScheme.incomeLimit}.`
      );
      return;
    }

    const newApplication = {
      id: `GC-${Date.now()}`,
      schemeName: selectedScheme.name,
      category: selectedScheme.category,
      ministry: selectedScheme.ministry,
      applicantName: formData.fullName,
      phone: formData.phone,
      aadhaar: formData.aadhaar,
      state: formData.state,
      income: yearlyIncome,
      status: "Submitted",
      submittedOn: new Date().toLocaleDateString(),
      nextStep: "Document verification pending",
    };

    const oldApplications =
      JSON.parse(localStorage.getItem("govconnectApplications")) || [];

    localStorage.setItem(
      "govconnectApplications",
      JSON.stringify([newApplication, ...oldApplications])
    );

    alert("Application submitted successfully!");
    navigate("/my-applications");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
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
              Explore government welfare schemes, check eligibility using income
              criteria, apply online, and track your application status.
            </p>
          </div>

          <button
            onClick={() => navigate("/my-applications")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold shadow-lg shadow-purple-700/30"
          >
            My Applications
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#0b1020]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl"
            >
              <div
                className={`w-16 h-1 rounded-full bg-gradient-to-r ${scheme.color} mb-5`}
              />

              <p className="text-xs text-cyan-400 font-semibold">
                {scheme.category}
              </p>

              <h2 className="text-xl font-bold mt-2">{scheme.name}</h2>

              <p className="text-sm text-gray-400 mt-2">{scheme.ministry}</p>

              <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                {scheme.benefit}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Income Limit</p>
                  <h3 className="text-sm font-bold mt-1">
                    Rs. {scheme.incomeLimit}
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Processing</p>
                  <h3 className="text-sm font-bold mt-1">
                    {scheme.processing}
                  </h3>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-400 mb-2">
                  Required Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {scheme.documents.map((doc) => (
                    <span
                      key={doc}
                      className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Deadline: {scheme.deadline}
              </p>

              <button
                onClick={() => openApply(scheme)}
                className={`w-full mt-5 py-3 rounded-lg font-semibold bg-gradient-to-r ${scheme.color}`}
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#0b1020] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedScheme.name}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Fill essential details to check eligibility and submit.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                X
              </button>
            </div>

            <form onSubmit={submitApplication} className="space-y-4 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="Aadhaar number"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <input
                type="number"
                placeholder="Annual family income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-300">
                Eligibility income limit for this scheme is{" "}
                <span className="text-cyan-400 font-bold">
                  Rs. {selectedScheme.incomeLimit}
                </span>
                .
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r ${selectedScheme.color}`}
              >
                Check Eligibility and Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;
