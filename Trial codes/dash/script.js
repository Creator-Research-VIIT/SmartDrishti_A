// Chart setup
const ctx = document.getElementById("waterChart").getContext("2d");
const waterChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Water Level (%)",
      data: [],
      borderColor: "rgba(0, 114, 189, 1)",
      backgroundColor: "rgba(0, 114, 189, 0.2)",
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { min: 0, max: 100 } }
  }
});

// Audio files
const audioA = new Audio("audioa.mp3");
const audioB = new Audio("audiob.mp3");
const audioC = new Audio("audioc.mp3");
const siren = new Audio("siren.mp3");

// Play sound according to level
function playAudioForLevel(level) {
  if (level <= 30) {
    audioA.play();
  } else if (level <= 70) {
    audioB.play();
  } else if (level < 100) {
    audioC.play();
  } else if (level === 100) {
    siren.play();
  }
}

function updateTank(value) {
  // Tank visual
  document.getElementById("water").style.height = value + "%";
  document.getElementById("currentLevel").innerText = value + "%";

  // Emoji reaction
  let emoji = "🤔";
  if (value < 10) emoji = "🥺🚱";
  else if (value < 30) emoji = "😢💧";
  else if (value < 70) emoji = "😊👌";
  else if (value < 100) emoji = "😁🚰";
  else emoji = "🚨😲 FULL! 🚨";
  document.getElementById("emoji").innerText = emoji;

  // Play sound
  playAudioForLevel(value);

  // Update chart
  const now = new Date().toLocaleTimeString();
  waterChart.data.labels.push(now);
  waterChart.data.datasets[0].data.push(value);

  if (waterChart.data.labels.length > 10) {
    waterChart.data.labels.shift();
    waterChart.data.datasets[0].data.shift();
  }
  waterChart.update();

  // Update history
  const historyList = document.getElementById("historyList");
  const li = document.createElement("li");
  li.textContent = `${now} → ${value}%`;
  historyList.prepend(li);

  // Keep only last 15 records
  if (historyList.children.length > 15) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Manual entry
function setLevel() {
  const val = parseInt(document.getElementById("levelInput").value);
  if (val >= 0 && val <= 100) {
    updateTank(val);
  } else {
    alert("Please enter a number between 0 and 100!");
  }
}

// Save & Load API Settings
function saveAPISettings() {
  const apiKey = (document.getElementById("apiKeyInput")?.value || "").trim();
  const templateId = (document.getElementById("templateIdInput")?.value || "").trim();
  localStorage.setItem("sd_apiKey", apiKey);
  localStorage.setItem("sd_templateId", templateId);
  const status = document.getElementById("apiStatus");
  if (status) {
    status.textContent = "Saved ✔";
    setTimeout(() => (status.textContent = ""), 1500);
  }
}

function loadAPISettings() {
  const apiKey = localStorage.getItem("sd_apiKey") || "";
  const templateId = localStorage.getItem("sd_templateId") || "";
  const apiKeyEl = document.getElementById("apiKeyInput");
  const templateIdEl = document.getElementById("templateIdInput");
  if (apiKeyEl) apiKeyEl.value = apiKey;
  if (templateIdEl) templateIdEl.value = templateId;
}

// Receive data entry point (from HTTP or test button)
function receiveData(level) {
  const value = parseInt(level);
  if (!Number.isFinite(value)) return;
  if (value < 0 || value > 100) return;
  updateTank(value);
}

// Test HTTP Data (simulate incoming POST/GET)
function testHTTPData() {
  const random = Math.floor(Math.random() * 101);
  receiveData(random);
}

// Parse query params for optional auto-update
function handleQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get("apiKey");
  const templateId = params.get("templateId");
  const level = params.get("level");

  if (apiKey) localStorage.setItem("sd_apiKey", apiKey);
  if (templateId) localStorage.setItem("sd_templateId", templateId);

  // reflect in UI if present
  loadAPISettings();

  if (level !== null) {
    receiveData(level);
  }
}

// Init on load
window.addEventListener("DOMContentLoaded", () => {
  loadAPISettings();
  handleQueryParams();
});

// Download PDF
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const dashboard = document.getElementById("dashboard");

  const canvas = await html2canvas(dashboard);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.text("SmartDrishti - Water Level Report", 10, 10);
  pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
  pdf.save("WaterLevelReport.pdf");
}
