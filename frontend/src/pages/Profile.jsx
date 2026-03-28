import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Profile() {

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "System Administrator",
    phone: "",
    address: ""
  });

  const [profilePic, setProfilePic] = useState(null);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => {
      setProfile({
        fullName: res.data.username,
        email: res.data.email || "",
        role: res.data.role || "System Administrator",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
    })
    .catch(() => toast.error("Failed to load profile"));
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePic = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setProfilePic(img);
  };

  // ================= SAVE PROFILE =================
  const saveProfile = () => {

    axios.post(
      "http://127.0.0.1:8000/api/accounts/update-profile/",
      {
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        role: profile.role
      },
      { headers: { Authorization: `Token ${token}` } }
    )
    .then(() => {
      toast.success("Profile updated successfully");
    })
    .catch(() => {
      toast.error("Update failed");
    });

  };

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h2 className="text-2xl font-bold dark:text-white">
        Profile
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT CARD */}
        <div className="p-6 rounded-xl shadow text-center
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-gray-700">

          <img
            src={
              profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-28 h-28 mx-auto rounded-full border-4 border-blue-500 object-cover"
          />

          <h3 className="mt-4 text-lg font-semibold dark:text-white">
            {profile.fullName}
          </h3>

          <p className="text-gray-500 dark:text-gray-400">
            {profile.role}
          </p>

          <label className="mt-4 inline-block cursor-pointer
            px-4 py-2 rounded-lg
            bg-blue-600 text-white hover:bg-blue-700 transition">

            Change Picture
            <input type="file" hidden onChange={handleProfilePic} />
          </label>

        </div>

        {/* RIGHT CARD */}
        <div className="md:col-span-2 p-6 rounded-xl shadow
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-gray-700 space-y-4">

          <h3 className="text-lg font-semibold dark:text-white">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <Input label="Full Name (Read Only)" name="fullName" value={profile.fullName} disabled />
            <Input label="Email" name="email" value={profile.email} onChange={handleChange} />
            <Input label="Role" name="role" value={profile.role} onChange={handleChange} />
            <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} />

          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg border
              bg-gray-100 dark:bg-[#1e293b]
              dark:border-gray-600 dark:text-white outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveProfile}
              className="px-5 py-2 rounded-lg
              bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// INPUT COMPONENT
const Input = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full mt-1 px-3 py-2 rounded-lg border
      bg-gray-100 dark:bg-[#1e293b]
      dark:border-gray-600 dark:text-white outline-none
      disabled:opacity-60"
    />
  </div>
);