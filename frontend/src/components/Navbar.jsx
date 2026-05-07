import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-white">Gov Schemes</h1>

      <div className="space-x-4">
        <Link to="/my-applications" className="hover:text-blue-400">
        My Applications
        </Link>
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
        <Link to="/register" className="hover:text-blue-400">Register</Link>
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;