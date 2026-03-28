import { useEffect, useState } from "react";
import { FiLogOut, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({ darkMode, setDarkMode }) {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [alertCount, setAlertCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 🔥 FORMAT COUNT
  const formatCount = (num) => {
    if (num > 9999) return "9.9K+";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  // 🔥 FETCH ALERT COUNT
  const fetchAlertCount = () => {
    axios
      .get("http://127.0.0.1:8000/api/alerts/count/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setAlertCount(res.data.count);
      })
      .catch(() => {
        console.log("Failed to load alert count");
      });
  };

  // 🔥 FETCH SETTINGS (notification toggle)
  const fetchSettings = () => {
    axios
      .get("http://127.0.0.1:8000/api/settings/get/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setNotificationsEnabled(res.data.email); // 🔥 IMPORTANT
      })
      .catch(() => {
        console.log("Failed to load settings");
      });
  };

  // 🔥 AUTO REFRESH
  useEffect(() => {
    fetchAlertCount();
    fetchSettings();

    const interval = setInterval(() => {
      fetchAlertCount();
      fetchSettings(); // keep synced
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="px-8 py-6 flex justify-between items-center
      bg-white dark:bg-[#0f172a]
      border-b border-gray-200 dark:border-gray-700 transition">

      <div className="flex flex-col leading-tight">
        <h1 className="text-2xl font-bold tracking-wide dark:text-white">
          Smart IoT
        </h1>
        <p className="text-xl text-black-500 dark:text-gray-400">
          Monitoring & Fault Detection Platform
        </p>
      </div>

      <div className="flex items-center gap-5">

        {/* 🔔 BELL */}
        <div
          onClick={() => navigate("/alerts")}
          className="relative cursor-pointer"
        >
          <FiBell className="text-3xl dark:text-white" />

          {/* ✅ SHOW COUNT ONLY IF ENABLED */}
          {notificationsEnabled && alertCount > 0 && (
            <span className="absolute -top-2 -right-2
              bg-red-500 text-white text-xs
              px-1.5 py-0.5 rounded-full">
              {formatCount(alertCount)}
            </span>
          )}
        </div>

        {/* 🌙 DARK MODE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-5 py-3 rounded-lg text-sm transition
          bg-gray-200 hover:bg-gray-300
          dark:bg-[#1e293b] dark:text-white dark:hover:bg-[#334155]"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-red-500 hover:bg-red-600 text-white"
        >
          <FiLogOut /> Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;