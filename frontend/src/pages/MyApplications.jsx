import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../config";
import { getToken } from "../utils/auth";

const STATUS_CONFIG = {
  Submitted: {
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
    dot: "bg-amber-400", color: "from-amber-400 to-orange-500",
  },
  Approved: {
    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
    dot: "bg-emerald-400", color: "from-emerald-400 to-teal-500",
  },
  Rejected: {
    bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200",
    dot: "bg-rose-400", color: "from-rose-400 to-red-500",
  },
  "Under Review": {
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
    dot: "bg-blue-400", color: "from-blue-400 to-cyan-500",
  },
};

const CATEGORY_COLORS = {
  Agriculture: "from-green-400 to-emerald-500",
  Healthcare: "from-red-400 to-rose-500",
  Housing: "from-orange-400 to-amber-500",
  Education: "from-blue-400 to-indigo-500",
  Business: "from-violet-400 to-purple-500",
  Employment: "from-cyan-400 to-teal-500",
  "Women Welfare": "from-pink-400 to-fuchsia-500",
  Pension: "from-slate-400 to-gray-500",
  Technology: "from-sky-400 to-blue-500",
  Insurance: "from-lime-400 to-green-500",
  Sports: "from-yellow-400 to-orange-500",
};

// ─── Upload Modal ────────────────────────────────────────────────────────────
function UploadModal({ app, onClose }) {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      setLoadingDocs(true);
      const res = await fetch(`${API_URL}/api/documents/${app.application_id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName.trim()) {
      alert("Please select a file and enter a document name.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicationId", app.application_id);
    formData.append("documentName", documentName.trim());
    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Upload failed"); return; }
      setFile(null);
      setDocumentName("");
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await fetch(`${API_URL}/api/documents/${uploadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchDocs();
    } catch (err) { console.error(err); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const fileIcon = (url) => {
    if (!url) return "📄";
    const ext = url.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📕";
    if (["jpg", "jpeg", "png"].includes(ext)) return "🖼️";
    return "📄";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500" />
        <div className="px-6 pt-5 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
            <p className="text-sm text-gray-400 mt-0.5 truncate max-w-xs">{app.scheme_name}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <input
            type="text"
            placeholder="Document name (e.g. Aadhaar Card, Income Certificate)"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm focus:border-cyan-400 transition-colors"
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragOver ? "border-cyan-400 bg-cyan-50"
              : file ? "border-emerald-400 bg-emerald-50"
              : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50"
            }`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
              className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            {file ? (
              <div>
                <p className="text-2xl mb-1">{fileIcon(file.name)}</p>
                <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📂</p>
                <p className="text-sm font-semibold text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG · Max 5MB</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !file || !documentName.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</>
            ) : "⬆ Upload Document"}
          </button>

          <div className="border-t border-gray-100" />

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Uploaded Documents ({documents.length})
            </p>
            {loadingDocs ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-2xl">
                <p className="text-2xl mb-1">📭</p>
                <p className="text-sm text-gray-400">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <div key={doc.upload_id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <span className="text-xl">{fileIcon(doc.file_url)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 truncate">{doc.document_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`${API_URL}${doc.file_url}`} target="_blank" rel="noreferrer"
                        className="text-xs text-cyan-600 font-semibold hover:underline">View</a>
                      <button onClick={() => handleDelete(doc.upload_id)}
                        className="text-xs text-rose-500 font-semibold hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────
function StatsBar({ applications }) {
  const stats = [
    { label: "Total", value: applications.length, color: "from-cyan-500 to-blue-600", text: "text-cyan-700" },
    { label: "Submitted", value: applications.filter((a) => a.status === "Submitted").length, color: "from-amber-400 to-orange-500", text: "text-amber-700" },
    { label: "Approved", value: applications.filter((a) => a.status === "Approved").length, color: "from-emerald-400 to-teal-500", text: "text-emerald-700" },
    { label: "Rejected", value: applications.filter((a) => a.status === "Rejected").length, color: "from-rose-400 to-red-500", text: "text-rose-700" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 p-4 shadow-lg">
          <div className={`h-1 rounded-full bg-gradient-to-r ${s.color} mb-3`} />
          <p className="text-3xl font-extrabold text-gray-800">{s.value}</p>
          <p className={`text-xs font-semibold mt-1 ${s.text}`}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Application Card ────────────────────────────────────────────────────────
function ApplicationCard({ app, index, onUpload }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[app.status] || STATUS_CONFIG["Submitted"];
  const catColor = CATEGORY_COLORS[app.category] || "from-cyan-500 to-violet-600";
  const formattedDate = app.submitted_on
    ? new Date(app.submitted_on).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${catColor}`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${catColor} text-white mb-2`}>
              {app.category || "Government"}
            </span>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">{app.scheme_name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{app.ministry || "Government of India"}</p>
          </div>
          <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
            {app.status || "Submitted"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Applicant</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{app.applicant_name || "—"}</p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Income</p>
            <p className="text-sm font-semibold text-gray-700">₹{Number(app.annual_income || 0).toLocaleString()}</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Submitted</p>
            <p className="text-sm font-semibold text-gray-700">{formattedDate}</p>
          </div>
        </div>

        {app.next_step && (
          <div className="mt-4 flex items-start gap-2 bg-gradient-to-r from-cyan-50 to-violet-50 rounded-xl px-4 py-3 border border-cyan-100">
            <span className="text-base mt-0.5">📌</span>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Next Step</p>
              <p className="text-sm text-gray-700 font-medium mt-0.5">{app.next_step}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setExpanded(!expanded)}
            className="text-sm text-cyan-600 font-semibold hover:text-violet-600 transition-colors">
            {expanded ? "Hide details ▲" : "View details ▼"}
          </button>
          <button onClick={() => onUpload(app)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition-all">
            📎 Upload Docs
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-semibold text-gray-700">{app.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">State</p>
                  <p className="text-sm font-semibold text-gray-700">{app.state || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Aadhaar</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {app.aadhaar_number ? `****-****-${String(app.aadhaar_number).slice(-4)}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Application ID</p>
                  <p className="text-sm font-semibold text-gray-700">#{app.application_id || "N/A"}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadTarget, setUploadTarget] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    let result = applications;
    if (filterStatus !== "All") result = result.filter((a) => a.status === filterStatus);
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      result = result.filter((a) =>
        (a.scheme_name || "").toLowerCase().includes(s) ||
        (a.applicant_name || "").toLowerCase().includes(s) ||
        (a.category || "").toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [applications, filterStatus, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.applications || [];
      setApplications(rows);
    } catch (err) {
      setError(`Failed to load applications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Applications...</p>
        </div>
      </div>
    );
  }

  const statuses = ["All", "Submitted", "Under Review", "Approved", "Rejected"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-rose-50 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-cyan-300/40 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-violet-300/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-5xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Gov</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600">Connect</span>
            </h1>
            <p className="mt-2 text-gray-500 font-medium">My Applications</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <button onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
              ← Dashboard
            </button>
            <button onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
              Browse Schemes
            </button>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-all">
              Logout
            </button>
          </div>
        </div>

        <StatsBar applications={applications} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-white/60">
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500" />
            <div className="flex items-center px-5 py-3.5">
              <span className="text-xl">🔍</span>
              <input type="text" placeholder="Search by scheme, applicant, category..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none ml-3 text-gray-700 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  filterStatus === s
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-lg scale-105"
                    : "bg-white/80 text-gray-600 border-white/60 hover:scale-105"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-medium">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {filtered.length > 0 ? (
            filtered.map((app, i) => (
              <ApplicationCard key={app.application_id || i} app={app} index={i} onUpload={setUploadTarget} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-5xl mb-4">📋</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {applications.length === 0 ? "No applications yet" : "No results found"}
              </h2>
              <p className="text-gray-500 mt-3">
                {applications.length === 0 ? "Browse schemes and apply to get started." : "Try changing your search or filter."}
              </p>
              {applications.length === 0 && (
                <button onClick={() => navigate("/")}
                  className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
                  Browse Schemes →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {uploadTarget && <UploadModal app={uploadTarget} onClose={() => setUploadTarget(null)} />}
      </AnimatePresence>
    </div>
  );
}
