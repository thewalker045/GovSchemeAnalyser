import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_URL from "../config";
import { getToken } from "../utils/auth";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingApp, setEditingApp] = useState(null);

  const [editForm, setEditForm] = useState({
    applicant_name: "",
    annual_income: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }

    } catch (err) {
      console.error(
        "Failed to fetch applications:",
        err
      );

      setApplications([]);

    } finally {
      setLoading(false);
    }
  };

  // Upload Documents
  const handleDocumentUpload = async (
    e,
    applicationId
  ) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("document", file);

    try {

      const res = await fetch(
        `${API_URL}/api/upload-document/${applicationId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${getToken()}`,
          },

          body: formData,
        }
      );

      const data = await res.json();

      alert(data.message);

      fetchApplications();

    } catch (err) {

      console.error(err);

      alert("Upload failed");
    }
  };

  // Status Colors
  const getStatusColor = (status) => {

    if (status === "Approved") {
      return "bg-emerald-100 text-emerald-600";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-500";
    }

    return "bg-cyan-100 text-cyan-600";
  };

  // Edit Modal
  const openEditModal = (app) => {

    setEditingApp(app);

    setEditForm({
      applicant_name: app.applicant_name,
      annual_income: app.annual_income,
    });
  };

  const closeEditModal = () => {
    setEditingApp(null);
  };

  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveChanges = () => {

    const updatedApps = applications.map((app) => {

      if (
        app.application_id ===
        editingApp.application_id
      ) {

        return {
          ...app,
          applicant_name:
            editForm.applicant_name,

          annual_income:
            editForm.annual_income,
        };
      }

      return app;
    });

    setApplications(updatedApps);

    alert("Application updated!");

    closeEditModal();
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading applications...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50 text-gray-900 overflow-hidden relative">

      {/* Background */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-cyan-400/40 blur-3xl rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-violet-400/40 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-extrabold">

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                My
              </span>{" "}

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">
                Applications
              </span>

            </h1>

            <p className="text-gray-500 mt-3">
              Track and manage your applications.
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Browse Schemes
          </button>

        </div>

        {/* Empty State */}
        {applications.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-2xl">

            <h2 className="text-3xl font-bold text-gray-800">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-4">
              Apply for a scheme to see it here.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {applications.map((app, index) => (

              <motion.div
                key={app.application_id}

                initial={{
                  opacity: 0,
                  y: 35,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: index * 0.08,
                }}

                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}

                className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-2xl"
              >

                {/* Accent */}
                <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 mb-6" />

                {/* Top */}
                <div className="flex justify-between gap-4 items-start">

                  <div>

                    <p className="text-xs text-cyan-500 font-semibold uppercase">
                      {app.category}
                    </p>

                    <h2 className="text-2xl font-bold mt-2 text-gray-800">
                      {app.scheme_name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      {app.ministry}
                    </p>

                  </div>

                  <span
                    className={`text-sm font-bold px-4 py-2 rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6">

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500">
                      Applicant
                    </p>

                    <h3 className="font-bold mt-2 text-gray-800">
                      {app.applicant_name}
                    </h3>

                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500">
                      Income
                    </p>

                    <h3 className="font-bold mt-2 text-gray-800">
                      ₹{" "}
                      {Number(
                        app.annual_income
                      ).toLocaleString()}
                    </h3>

                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500">
                      Submitted On
                    </p>

                    <h3 className="font-bold mt-2 text-gray-800">
                      {new Date(
                        app.submitted_on
                      ).toLocaleDateString()}
                    </h3>

                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-violet-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500">
                      Next Step
                    </p>

                    <h3 className="font-bold mt-2 text-gray-800">
                      {app.next_step}
                    </h3>

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-7">

                  {/* Edit */}
                  <button
                    onClick={() =>
                      openEditModal(app)
                    }
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                  >
                    Edit Details
                  </button>

                  {/* Upload */}
                  <label className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer">

                    Upload Documents

                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleDocumentUpload(
                          e,
                          app.application_id
                        )
                      }
                    />
                  </label>

                </div>

                {/* Documents */}
                <div className="mt-7">

                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    Uploaded Documents
                  </h3>

                  {app.documents &&
                  app.documents.length > 0 ? (

                    <div className="space-y-3">

                      {app.documents.map((doc) => (

                        <div
                          key={doc.document_id}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3"
                        >

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white">
                              📄
                            </div>

                            <div>

                              <p className="font-semibold text-gray-800">
                                {doc.document_name}
                              </p>

                              <p className="text-xs text-gray-500">
                                Uploaded Successfully
                              </p>

                            </div>

                          </div>

                          <a
                            href={`${API_URL}/${doc.document_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold"
                          >
                            View
                          </a>

                        </div>
                      ))}

                    </div>

                  ) : (

                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 text-center">

                      <p className="text-gray-500">
                        No documents uploaded yet.
                      </p>

                    </div>
                  )}

                </div>

              </motion.div>
            ))}

          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl"
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Edit Application
              </h2>

              <button
                onClick={closeEditModal}
                className="text-2xl text-gray-400"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="applicant_name"
                placeholder="Applicant Name"
                value={editForm.applicant_name}
                onChange={handleEditChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
              />

              <input
                type="number"
                name="annual_income"
                placeholder="Annual Income"
                value={editForm.annual_income}
                onChange={handleEditChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
              />

              <button
                onClick={saveChanges}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg"
              >
                Save Changes
              </button>

            </div>

          </motion.div>

        </div>
      )}
    </div>
  );
}

export default MyApplications;