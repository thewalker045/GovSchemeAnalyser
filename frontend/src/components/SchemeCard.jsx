import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function SchemeCard({ scheme }) {
  console.log("Scheme Data:", scheme);

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.01,
      }}
      className="bg-[#081120]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
    >
      {/* Category */}
      <p className="text-cyan-400 font-semibold text-lg">
        {scheme.category}
      </p>

      {/* Scheme Name */}
      <h2 className="text-2xl font-bold mt-2 text-white">
        {scheme.scheme_name}
      </h2>

      {/* Ministry */}
      <p className="text-gray-400 mt-2 text-sm">
        {scheme.ministry}
      </p>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mt-5">
        {scheme.benefit_description}
      </p>

      {/* Income + Processing */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Income */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Income Limit
          </p>

          <h3 className="text-xl font-bold mt-2 text-white">
            Rs.{" "}
            {scheme.income_limit
              ? Number(scheme.income_limit).toLocaleString()
              : "Not Available"}
          </h3>
        </div>

        {/* Processing */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Processing
          </p>

          <h3 className="text-xl font-bold mt-2 text-white">
            {scheme.processing_days || "N/A"}
          </h3>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6">
        <h3 className="font-semibold text-white mb-3">
          Required Documents
        </h3>

        <div className="flex flex-wrap gap-2">
          {scheme.documents &&
          scheme.documents.length > 0 ? (
            scheme.documents.map((doc, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs"
              >
                {doc}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">
              No documents listed
            </span>
          )}
        </div>
      </div>

      {/* Deadline */}
      <p className="text-gray-500 text-sm mt-6">
        Deadline: {scheme.deadline}
      </p>

      {/* Status */}
      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            scheme.is_active
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {scheme.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Apply Button */}
      <Link
        to={`/apply/${scheme.scheme_id}`}
        className="block w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-lg text-center hover:scale-[1.02] transition"
      >
        Apply Now
      </Link>
    </motion.div>
  );
}

export default SchemeCard;