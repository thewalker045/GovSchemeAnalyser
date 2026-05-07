import { Link } from "react-router-dom";

function SchemeCard({ scheme }) {
  return (
    <div className="bg-slate-800 p-5 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{scheme.scheme_name}</h2>

      <p className="text-gray-300 mt-2">{scheme.description}</p>

      <p className="mt-2 text-sm text-green-400">
        Status: {scheme.status}
      </p>

      <Link
        to={`/apply/${scheme.scheme_id}`}
        className="inline-block mt-4 text-blue-400 hover:underline"
      >
        Apply Now →
      </Link>
    </div>
  );
}

export default SchemeCard;