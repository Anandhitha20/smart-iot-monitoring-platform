import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    device_model: "",
    serial_number: "",
    device_location: "",
    ip_address: "",
    temperature: "",
    vibration: "",
    humidity: "",
    noise: "",
    pressure: "",
    status: "Normal",
  });

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const loadDevices = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/devices/devices/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setDevices(res.data);
    } catch (err) {
      toast.error("Failed to load devices");
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= ADD =================
  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/devices/devices/",
        formData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      toast.success("Device added successfully");
      setShowModal(false);
      loadDevices();
    } catch (err) {
      toast.error("Error adding device");
    }
  };

  // ================= DELETE =================
  const deleteDevice = async (id) => {
    if (!window.confirm("Delete this device?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/devices/devices/${id}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      toast.success("Device deleted");
      loadDevices();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Devices</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Device
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Model</th>
              <th>Temp</th>
              <th>Vibration</th>
              <th>Humidity</th>
              <th>Noise</th>
              <th>Pressure</th>
              <th>Status</th>
              <th>Monitor</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {devices.map((d) => (
              <tr
                key={d.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-[#1e293b] transition"
              >
                <td className="p-3">{d.name}</td>
                <td>{d.device_model}</td>
                <td>{d.temperature}°C</td>
                <td>{d.vibration} g</td>
                <td>{d.humidity} %</td>
                <td>{d.noise} dB</td>
                <td>{d.pressure} Pa</td>

                {/* STATUS BADGE */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.status === "Fault"
                        ? "bg-red-100 text-red-600 dark:bg-red-500/20"
                        : "bg-green-100 text-green-600 dark:bg-green-500/20"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                {/* MONITOR */}
                <td>
                  <Link
                    to={`/device/${d.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                </td>

                {/* DELETE */}
                <td>
                  <button
                    onClick={() => deleteDevice(d.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Add Device
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Model" name="device_model" value={formData.device_model} onChange={handleChange} />
              <Input label="Serial" name="serial_number" value={formData.serial_number} onChange={handleChange} />
              <Input label="Location" name="device_location" value={formData.device_location} onChange={handleChange} />
              <Input label="IP Address" name="ip_address" value={formData.ip_address} onChange={handleChange} />

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ================= INPUT COMPONENT =================
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-[#1e293b] dark:border-gray-600 dark:text-white"
    />
  </div>
);

export default Devices;