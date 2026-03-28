import { NavLink } from "react-router-dom";
import {
  FiHome, FiCpu, FiBell, FiSettings, FiUser, FiLogOut
} from "react-icons/fi";

const Sidebar = () => {

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${isActive 
        ? "bg-blue-600 text-white shadow-lg" 
        : "text-gray-300 hover:bg-blue-500/20 hover:text-white"}`;

  return (
    <div className="w-64 h-screen fixed left-0 top-0 
      bg-gradient-to-b from-[#020617] to-[#0f172a] 
      border-r border-[#1e293b]
      text-white flex flex-col justify-between p-5">

      <div>

        <nav className="flex flex-col gap-4">

          <NavLink to="/dashboard" className={linkStyle}>
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/devices" className={linkStyle}>
            <FiCpu /> Devices
          </NavLink>

          <NavLink to="/alerts" className={linkStyle}>
            <FiBell /> Alerts
          </NavLink>

          <NavLink to="/settings" className={linkStyle}>
            <FiSettings /> Settings
          </NavLink>

          <NavLink to="/profile" className={linkStyle}>
            <FiUser /> Profile
          </NavLink>

        </nav>
      </div>

    </div>
  );
};

export default Sidebar;