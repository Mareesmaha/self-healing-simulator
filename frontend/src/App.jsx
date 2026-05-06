import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const BASE_URL = "http://127.0.0.1:49673";


function App() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 5)]);
  };

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/metrics`);
      setData(res.data);

      const time = new Date().toLocaleTimeString();
      setChartData((prev) => [
        ...prev.slice(-9),
        {
          time,
          load: res.data.usersLoad,
          responseTime: res.data.responseTime
        }
      ]);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const increaseLoad = async () => {
    try {
      await axios.post(`${BASE_URL}/increase-load`);
      addLog("Traffic increased");
      fetchMetrics();
    } catch (error) {
      console.error("Error increasing load:", error);
    }
  };

  const crashPod = async () => {
    try {
      await axios.post(`${BASE_URL}/crash-pod`);
      addLog("Pod crash simulated");
      fetchMetrics();
    } catch (error) {
      console.error("Error crashing pod:", error);
    }
  };

  const deployVersion = async () => {
    try {
      await axios.post(`${BASE_URL}/deploy`);
      addLog("Deployment triggered");
      fetchMetrics();
    } catch (error) {
      console.error("Error deploying version:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <h2 style={{ padding: "20px", color: "white" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0b1020",
        color: "white",
        minHeight: "100vh",
        padding: "30px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "56px", marginBottom: "10px" }}>
          🚀 Reliability + DevOps Simulator
        </h1>

        <hr style={{ border: "1px solid #444", marginBottom: "30px" }} />

        <div
          style={{
            background: "#151c33",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          <p><b>Status:</b> {data.status}</p>
          <p><b>Version:</b> {data.version}</p>
          <p><b>Users Load:</b> {data.usersLoad}</p>
          <p><b>Instances:</b> {data.instances}</p>
          <p><b>Response Time:</b> {data.responseTime} ms</p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <button onClick={increaseLoad} style={buttonStyle}>➕ Increase Load</button>
          <button onClick={crashPod} style={buttonStyle}>💥 Crash Pod</button>
          <button onClick={deployVersion} style={buttonStyle}>🚀 Deploy New Version</button>
        </div>

        <div
          style={{
            background: "#151c33",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "25px"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Live Performance Chart</h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="load" stroke="#00c853" strokeWidth={3} />
                <Line type="monotone" dataKey="responseTime" stroke="#ff5252" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            textAlign: "left"
          }}
        >
          <div
            style={{
              background: "#151c33",
              borderRadius: "16px",
              padding: "20px"
            }}
          >
            <h2>Pod Status</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.pods?.map((pod) => (
                <li key={pod.id} style={{ marginBottom: "10px" }}>
                  {pod.id} - {pod.status}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: "#151c33",
              borderRadius: "16px",
              padding: "20px"
            }}
          >
            <h2>Live Logs</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {logs.length === 0 ? (
                <li>No events yet</li>
              ) : (
                logs.map((log, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    {log}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: "8px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#2563eb",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};

export default App;