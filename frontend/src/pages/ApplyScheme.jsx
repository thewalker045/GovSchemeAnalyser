import { useParams } from "react-router-dom";
import { schemes } from "../utils/mockData";

function ApplyScheme() {
  const { schemeId } = useParams();

  const scheme = schemes.find(
    (s) => s.scheme_id === parseInt(schemeId)
  );

  const handleApply = () => {
  const newApplication = {
    id: Date.now(),
    schemeName: scheme.scheme_name,
    status: "Pending",
    appliedDate: new Date().toLocaleDateString(),
  };

  const existing =
    JSON.parse(localStorage.getItem("govconnectApplications")) || [];

  existing.push(newApplication);

  localStorage.setItem(
    "govconnectApplications",
    JSON.stringify(existing)
  );

  alert("Application Submitted Successfully!");
};

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Apply for {scheme?.scheme_name}
      </h1>

      <p className="mb-4 text-gray-300">
        {scheme?.description}
      </p>

      <button
        onClick={handleApply}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
      >
        Submit Application
      </button>
    </div>
  );
}

export default ApplyScheme;