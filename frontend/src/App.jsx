import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import DeviceMonitor from "./pages/DeviceMonitor";
import Layout from "./components/Layout";
import ProfilePage from "./pages/Profile";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <>
          <Toaster position="top-right" />
          <Routes>

            {/* LOGIN PAGE → NO SIDEBAR */}
            <Route path="/login" element={<Login />} />

            {/* PAGES WITH SIDEBAR */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="devices" element={<Devices />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="device/:id" element={<DeviceMonitor />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

          </Routes>
        </>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;