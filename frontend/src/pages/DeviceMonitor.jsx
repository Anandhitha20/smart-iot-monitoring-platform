import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DeviceMonitor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState(null);
  const [allDevices, setAllDevices] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 LOAD ALL DEVICES (dropdown)
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/devices/devices/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const data = res.data;
        if (data.results) setAllDevices(data.results);
        else if (Array.isArray(data)) setAllDevices(data);
        else setAllDevices([]);
      })
      .catch(() => setAllDevices([]));
  }, []);

  // 🔥 AUTO REFRESH FUNCTION
  const fetchDeviceData = () => {
    axios
      .get(`http://127.0.0.1:8000/api/devices/device/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setDevice(res.data));

    axios
      .get(`http://127.0.0.1:8000/api/devices/device/${id}/history/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setHistory(res.data));
  };

  // 🔥 AUTO REFRESH EVERY 3 SEC
  useEffect(() => {
    fetchDeviceData(); // first load

    const interval = setInterval(() => {
      fetchDeviceData();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (!device || !history)
    return <p className="p-6 dark:text-white">Loading Device...</p>;

  // 🔥 STATUS LOGIC
  let statusText = "NORMAL";
  let statusColor = "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";

  if (
    device.temperature > 90 ||
    device.vibration > 8 ||
    device.humidity > 95 ||
    device.noise > 100 ||
    device.pressure > 150
  ) {
    statusText = "CRITICAL";
    statusColor = "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
  } else if (
    device.temperature > 70 ||
    device.vibration > 5 ||
    device.humidity > 80 ||
    device.noise > 70 ||
    device.pressure > 130
  ) {
    statusText = "WARNING";
    statusColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
  }

  // 🔥 CHART DATA
  const chartData = {
    labels: history.timestamps.slice(-20).map((t) =>
      new Date(t).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Temperature",
        data: history.temperature.slice(-20),
        borderColor: "#ff9f40",
      },
      {
        label: "Vibration",
        data: history.vibration.slice(-20),
        borderColor: "#00c4ff",
      },
      {
        label: "Humidity",
        data: history.humidity.slice(-20),
        borderColor: "#22c55e",
      },
      {
        label: "Noise",
        data: history.noise.slice(-20),
        borderColor: "#ef4444",
      },
      {
        label: "Pressure",
        data: history.pressure.slice(-20),
        borderColor: "#a855f7",
      },
    ],
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Device Monitor
        </h2>

        <select
          value={id}
          onChange={(e) => navigate(`/device/${e.target.value}`)}
          className="px-3 py-2 rounded-lg
          bg-gray-100 dark:bg-[#1e293b]
          dark:text-white outline-none"
        >
          {allDevices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS + SENSOR CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

        <StatusCard statusText={statusText} statusColor={statusColor} />
        <Card title="Temperature" value={`${device.temperature}°C`} color="text-orange-500" />
        <Card title="Vibration" value={`${device.vibration} g`} color="text-blue-500" />
        <Card title="Humidity" value={`${device.humidity}%`} color="text-green-500" />
        <Card title="Noise" value={`${device.noise} dB`} color="text-red-500" />
        <Card title="Pressure" value={`${device.pressure} Pa`} color="text-purple-500" />

      </div>

      {/* CHART + INFO */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2 p-5 rounded-xl shadow
          bg-white dark:bg-[#0f172a] border dark:border-gray-700">

          <h3 className="font-semibold mb-3 dark:text-white">
            Sensor Trend
          </h3>

          <Line data={chartData} />
        </div>

        <div className="p-5 rounded-xl shadow
          bg-white dark:bg-[#0f172a] border dark:border-gray-700
          text-sm space-y-2 dark:text-white">

          <h3 className="font-semibold">Device Info</h3>

          <p><b>Name:</b> {device.name}</p>
          <p><b>Model:</b> {device.device_model}</p>
          <p><b>Serial:</b> {device.serial_number}</p>
          <p><b>Location:</b> {device.device_location}</p>
          <p><b>IP:</b> {device.ip_address}</p>

          <h3 className="font-semibold mt-4">Latest Values</h3>

          <p>Temp: {device.temperature}°C</p>
          <p>Vibration: {device.vibration} g</p>
          <p>Humidity: {device.humidity}%</p>
          <p>Noise: {device.noise} dB</p>
          <p>Pressure: {device.pressure} Pa</p>

        </div>
      </div>
    </div>
  );
}

// 🔥 STATUS CARD
function StatusCard({ statusText, statusColor }) {
  return (
    <div className="p-4 rounded-xl shadow text-center
      bg-white dark:bg-[#0f172a] border dark:border-gray-700">

      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
        {statusText}
      </span>
    </div>
  );
}

// 🔥 SENSOR CARD
function Card({ title, value, color }) {
  return (
    <div className="p-4 rounded-xl shadow text-center
      bg-white dark:bg-[#0f172a] border dark:border-gray-700">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className={`text-lg font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}