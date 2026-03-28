import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
  FiCpu,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

function Dashboard() {
  const [totalDevices, setTotalDevices] = useState(0);
  const [normalDevices, setNormalDevices] = useState(0);
  const [faultDevices, setFaultDevices] = useState(0);
  const [offlineDevices, setOfflineDevices] = useState(0);

  const token = localStorage.getItem("token");

  const fetchStats = () => {
    axios
      .get("http://127.0.0.1:8000/api/devices/dashboard/", {
        headers: { Authorization: "Token " + token },
      })
      .then((res) => {
        const total = res.data.total_devices;
        const normal = res.data.normal_count;
        const fault = res.data.fault_count;

        setTotalDevices(total);
        setNormalDevices(normal);
        setFaultDevices(fault);

        const offline = total - (normal + fault);
        setOfflineDevices(offline >= 0 ? offline : 0);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // ================= HEALTH CALC =================
  const health =
    totalDevices === 0
      ? 0
      : Math.round((normalDevices / totalDevices) * 100);

  // ================= DONUT DATA =================
  const pieData = {
    labels: ["Normal", "Fault"], // 
    datasets: [
      {
        data: [normalDevices, faultDevices],
        backgroundColor: ["#3b82f6", "#f59e0b"],
        borderWidth: 0,
        cutout: "70%", // 
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom", // 
      },
    },
  };


  const barData = {
    labels: ["Normal", "Fault"],
    datasets: [
      {
        label: "Devices",
        data: [normalDevices, faultDevices],
        backgroundColor: ["#3b82f6", "#f59e0b"],
      },
    ],
  };

  // ================= ACTIONS =================
  const startSimulation = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/devices/sim/start/",
        {},
        { headers: { Authorization: "Token " + token } }
      );
      toast.success("🚀 Simulation Started");
    } catch {
      toast.error("❌ Failed to start simulation");
    }
  };

  const stopSimulation = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/devices/sim/stop/",
        {},
        { headers: { Authorization: "Token " + token } }
      );
      toast("🛑 Simulation Stopped");
    } catch {
      toast.error("❌ Failed to stop simulation");
    }
  };

  const forceFault = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/devices/sim/force-fault/",
        {},
        { headers: { Authorization: "Token " + token } }
      );
      toast.error("⚠️ Critical Fault Triggered!");
    } catch {
      toast.error("❌ Failed to trigger fault");
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card icon={<FiCpu />} title="Total Devices" value={totalDevices} color="text-blue-500" />

        <Card
          icon={<FiActivity />}
          title="System Health"
          value={`${health}%`}
          color="text-green-500"
        />

        <Card icon={<FiAlertTriangle />} title="Critical Alerts" value={faultDevices} color="text-red-500" />

        <Card icon={<FiCheckCircle />} title="Normal Devices" value={normalDevices} color="text-green-500" />

      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Device Status Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* DONUT CHART */}
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Pie data={pieData} options={pieOptions} />
              <p className="text-center text-sm text-gray-500 mt-2">
                System Health
              </p>
            </div>
          </div>

          {/* BAR */}
          <div className="h-72">
            <Bar data={barData} />
          </div>

        </div>
      </div>

      {/* ================= CONTROL ================= */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Simulation Control
        </h2>

        <div className="flex gap-4 flex-wrap">

          <button onClick={startSimulation} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Start
          </button>

          <button onClick={stopSimulation} className="px-5 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition">
            Stop
          </button>

          <button onClick={forceFault} className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Force Fault
          </button>

        </div>
      </div>

    </div>
  );
}

// ================= CARD =================
const Card = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
    <div className={`flex items-center gap-2 ${color}`}>
      {icon}
      <span>{title}</span>
    </div>
    <h2 className="text-2xl mt-2 font-bold text-gray-800 dark:text-white">
      {value}
    </h2>
  </div>
);

export default Dashboard;