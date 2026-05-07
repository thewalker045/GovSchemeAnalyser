function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">
          Admin Dashboard
        </h1>

        <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Total Schemes</h2>
          <p className="text-3xl font-bold text-cyan-400 mt-2">
            120+
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Applications</h2>
          <p className="text-3xl font-bold text-purple-400 mt-2">
            5,420
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-gray-400">Approved Users</h2>
          <p className="text-3xl font-bold text-green-400 mt-2">
            4,980
          </p>
        </div>

      </div>

      {/* RECENT APPLICATIONS */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Recent Applications
        </h2>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3">Applicant</th>
              <th className="p-3">Scheme</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b border-slate-700">
              <td className="p-3">Rahul Sharma</td>
              <td className="p-3">Free Laptop Scheme</td>
              <td className="p-3 text-yellow-400">Pending</td>
            </tr>

            <tr className="border-b border-slate-700">
              <td className="p-3">Anjali Verma</td>
              <td className="p-3">Healthcare Support</td>
              <td className="p-3 text-green-400">Approved</td>
            </tr>

            <tr>
              <td className="p-3">Rohit Kumar</td>
              <td className="p-3">Farmer Subsidy</td>
              <td className="p-3 text-red-400">Rejected</td>
            </tr>

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;