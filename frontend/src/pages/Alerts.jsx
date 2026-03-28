import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiDownloadCloud } from "react-icons/fi";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/alerts/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setAlerts(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // FILTER
  const filteredAlerts = alerts.filter((a) => {
    const device = a.device || "";
    const message = a.message || "";

    const matchSearch =
      device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filterType === "all"
        ? true
        : filterType === "temperature"
        ? a.temperature > 80
        : filterType === "vibration"
        ? a.vibration > 5
        : filterType === "humidity"
        ? a.humidity > 70
        : filterType === "noise"
        ? a.noise > 40
        : filterType === "pressure"
        ? a.pressure > 110
        : true;

    return matchSearch && matchFilter;
  });

  // CSV EXPORT
  const exportCSV = () => {
    const headers = [
      "Device",
      "Temperature",
      "Vibration",
      "Humidity",
      "Noise",
      "Pressure",
      "Message",
      "Timestamp",
    ];

    const rows = filteredAlerts.map((a) => [
      a.device,
      a.temperature,
      a.vibration,
      a.humidity,
      a.noise,
      a.pressure,
      a.message,
      new Date(a.created_at).toLocaleString(),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "alerts_data.csv";
    link.click();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Alerts & History
        </h2>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiDownloadCloud />
          Export CSV
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-4 rounded-xl shadow
        bg-white dark:bg-[#0f172a]
        border border-gray-200 dark:border-gray-700
        flex flex-col md:flex-row gap-4 justify-between">

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-full md:w-1/3
          bg-gray-100 dark:bg-[#1e293b] dark:text-white">

          <FiSearch />

          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg
          bg-gray-100 dark:bg-[#1e293b]
          dark:text-white outline-none"
        >
          <option value="all">All Alerts</option>
          <option value="temperature">Temperature</option>
          <option value="vibration">Vibration</option>
          <option value="humidity">Humidity</option>
          <option value="noise">Noise</option>
          <option value="pressure">Pressure</option>
        </select>
      </div>

      {/* COUNT */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Total Alerts: {alerts.length}
      </p>

      {/* TABLE */}
      <div className="rounded-xl shadow overflow-hidden
        bg-white dark:bg-[#0f172a]
        border border-gray-200 dark:border-gray-700">

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : filteredAlerts.length === 0 ? (
          <p className="p-6 text-gray-500">No alerts found.</p>
        ) : (
          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4">Device</th>
                <th className="p-4">Temp</th>
                <th className="p-4">Vibration</th>
                <th className="p-4">Humidity</th>
                <th className="p-4">Noise</th>
                <th className="p-4">Pressure</th>
                <th className="p-4">Message</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert) => {

                const isFault =
                  alert.message?.toLowerCase().includes("fault");

                return (
                  <tr
                    key={alert.id}
                    className="border-t dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-[#1e293b] transition"
                  >
                    <td className="p-4">{alert.device}</td>
                    <td className="p-4">{alert.temperature}</td>
                    <td className="p-4">{alert.vibration}</td>
                    <td className="p-4">{alert.humidity}</td>
                    <td className="p-4">{alert.noise}</td>
                    <td className="p-4">{alert.pressure}</td>

                    {/* 🔥 COLORED MESSAGE */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                        ${isFault
                          ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                          : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                        }`}
                      >
                        {alert.message}
                      </span>
                    </td>

                    <td className="p-4 text-xs">
                      {new Date(alert.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default Alerts;