let currentTokenId = 0;
let licenseData = {};
const mintBtn = document.getElementById("mintBtn");
const grantBtn = document.getElementById("grantBtn");
const viewBtn = document.getElementById("viewBtn");
const logoutBtn = document.getElementById("logoutBtn");
const messageBox = document.getElementById("message");
const licenseBox = document.getElementById("licenseDetails");

mintBtn.addEventListener("click", () => {
  const name = document.getElementById("nftName").value.trim();
  const desc = document.getElementById("nftDescription").value.trim();
  const file = document.getElementById("nftFile").files[0];

  if (!name || !desc || !file) {
    showMessage("⚠️ Please fill all fields and select a file!", "error");
    return;
  }

  currentTokenId++;
  showMessage(`✅ NFT Minted Successfully!
  Token ID: ${currentTokenId}
  Name: ${name}
  Description: ${desc}
  File: ${file.name}`, "success");
});

grantBtn.addEventListener("click", () => {
  const tokenId = document.getElementById("tokenId").value;
  const licensee = document.getElementById("licensee").value.trim();
  const rights = document.getElementById("rights").value.trim();
  const duration = parseInt(document.getElementById("duration").value);

  if (!tokenId || !licensee || !rights || !duration) {
    showMessage("⚠️ Please fill all license fields!", "error");
    return;
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + duration * 60000);

  licenseData[tokenId] = {
    owner: "0xE45F...123A",
    licensee,
    rights,
    issued: now,
    expiry,
  };

  showMessage(`✅ License granted for Token ${tokenId} to ${licensee}.`, "success");
});

viewBtn.addEventListener("click", () => {
  const tokenId = document.getElementById("viewTokenId").value;
  if (!tokenId) {
    showMessage("⚠️ Please enter Token ID to view license!", "error");
    return;
  }

  const data = licenseData[tokenId];
  if (!data) {
    licenseBox.innerHTML = `<p class="no-license">No license found for Token ${tokenId}.</p>`;
    return;
  }

  const status = Date.now() > data.expiry.getTime() ? "Expired ❌" : "Active ✅";

  licenseBox.innerHTML = `
    <div class="license-card">
      <p><strong>Owner:</strong> ${data.owner}</p>
      <p><strong>Licensee:</strong> ${data.licensee}</p>
      <p><strong>Rights:</strong> ${data.rights}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Issued:</strong> ${data.issued.toLocaleString()}</p>
      <p><strong>Expires:</strong> ${data.expiry.toLocaleString()}</p>
    </div>
  `;
});

logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    showMessage("👋 Logged out successfully!", "success");
    setTimeout(() => (window.location.href = "login.html"), 1500);
  }
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.style.color = type === "error" ? "red" : "green";
  messageBox.style.fontWeight = "bold";
}
