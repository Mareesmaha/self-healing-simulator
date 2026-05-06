const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const VERSION = process.env.APP_VERSION || "v2";

let currentLoad = 100;
let pods = [
  { id: "pod-1", status: "Running" },
  { id: "pod-2", status: "Running" },
  { id: "pod-3", status: "Running" }
];

app.get("/", (req, res) => {
  res.send(`Backend running - ${VERSION}`);
});

app.get("/metrics", (req, res) => {
  res.json({
    status: "HEALTHY",
    version: VERSION,
    usersLoad: currentLoad,
    instances: pods.length,
    responseTime: 100 + currentLoad / 2,
    pods: pods
  });
});

app.post("/increase-load", (req, res) => {
  currentLoad += 100;

  res.json({
    message: "Load increased successfully",
    currentLoad
  });
});

app.post("/crash-pod", (req, res) => {
  if (pods.length > 0) {
    pods[0].status = "Crashed";
  }

  res.json({
    message: "Pod crashed (simulated)",
    pods
  });
});

app.post("/deploy", (req, res) => {
  res.json({
    message: "Deployment triggered",
    version: VERSION
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});