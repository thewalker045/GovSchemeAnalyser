import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ApplyScheme from "./pages/ApplyScheme";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/apply/:schemeId" element={<ApplyScheme />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;