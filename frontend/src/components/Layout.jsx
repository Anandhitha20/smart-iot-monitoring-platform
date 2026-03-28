import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex">

      <Sidebar darkMode={darkMode} />

      <div className="flex-1 ml-64 min-h-screen transition-all
        bg-gray-100 dark:bg-[#0b1220]">

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;