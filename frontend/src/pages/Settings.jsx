import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSave, FiLock, FiBell } from "react-icons/fi";
import toast from "react-hot-toast";

const Settings = () => {

  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= LOAD SETTINGS =================
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/settings/get/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setNotifications(res.data.email);   
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load settings");
      });
  }, []);

  // ================= SAVE NOTIFICATIONS =================
  const saveNotifications = () => {
    axios
      .put(
        "http://127.0.0.1:8000/api/settings/update/",
        {
          email: notifications,   
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        alert("Notification settings updated");
      })
      .catch(() => {
        alert("Update failed");
      });
  };

  // ================= CHANGE PASSWORD =================
  const changePassword = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/settings/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      })
      .catch(() => toast.error("Incorrect old password"));
  };

  if (loading)
    return <p className="p-6 dark:text-white">Loading Settings...</p>;

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold dark:text-white">
        Settings
      </h1>

      {/* TABS */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">

        <button
          onClick={() => setActiveTab("account")}
          className={`pb-2 font-medium transition ${
            activeTab === "account"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Account
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-2 font-medium transition ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Notifications
        </button>

      </div>

      {/* ================= ACCOUNT TAB ================= */}
      {activeTab === "account" && (
        <div className="p-6 rounded-xl shadow
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-gray-700 space-y-4">

          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <FiLock /> Change Password
          </h2>

          <div className="space-y-3">

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border
              bg-gray-100 dark:bg-[#1e293b]
              dark:border-gray-600 dark:text-white outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border
              bg-gray-100 dark:bg-[#1e293b]
              dark:border-gray-600 dark:text-white outline-none"
            />

          </div>

          <button
            onClick={changePassword}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <FiLock /> Update Password
          </button>

        </div>
      )}

      {/* ================= NOTIFICATIONS TAB ================= */}
      {activeTab === "notifications" && (
        <div className="p-6 rounded-xl shadow
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-gray-700 space-y-6">

          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <FiBell /> Notification Settings
          </h2>

          {/* TOGGLE SWITCH */}
          <div className="flex items-center justify-between">

            <span className="dark:text-white">
              Enable Notifications
            </span>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition
              ${notifications ? "bg-blue-600" : "bg-gray-400"}`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow transform transition
                ${notifications ? "translate-x-7" : ""}`}
              />
            </button>

          </div>

          <button
            onClick={saveNotifications}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <FiSave /> Save Preferences
          </button>

        </div>
      )}

    </div>
  );
};

export default Settings;