let web3;
let nftContract;
let userWallet;
let currentTokenId = 0;
let licenseData = {};

const contractAddress = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

async function init() {
  const wallet = localStorage.getItem("userWallet");
  if (!wallet) {
    window.location.href = "index.html";
    return;
  }

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    userWallet = wallet;
    document.getElementById("userWallet").innerText = `Wallet: ${userWallet}`;
  } else {
    alert("MetaMask not detected!");
    return;
  }

  attachButtonEvents();
}

function attachButtonEvents() {
  document.getElementById("mintForm").addEventListener("submit", handleMint);
  document.getElementById("grantBtn").addEventListener("click", grantLicense);
  document.getElementById("viewBtn").addEventListener("click", viewLicense);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

function handleMint(e) {
  e.preventDefault();
  const name = document.getElementById("nftName").value;
  const description = document.getElementById("nftDescription").value;
  const fileInput = document.getElementById("nftFile");

  if (!name || !description || !fileInput.files.length) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    currentTokenId++;
    const preview = document.getElementById("preview");
    preview.innerHTML = `
      <div class="preview-card">
        <h4>Minted NFT #${currentTokenId}</h4>
        <p><b>Name:</b> ${name}</p>
        <p><b>Description:</b> ${description}</p>
        <p><b>File:</b> ${file.name}</p>
        <p><b>Type:</b> ${file.type || "Unknown"}</p>
        <p><b>Owner Wallet:</b> ${userWallet}</p>
      </div>
    `;
    alert(`🎉 NFT #${currentTokenId} has been generated successfully!`);
  };
  reader.readAsDataURL(file);
}

function grantLicense() {
  const tokenId = document.getElementById("tokenId").value;
  const licensee = document.getElementById("licensee").value;
  const rights = document.getElementById("rights").value;
  const duration = parseInt(document.getElementById("duration").value);

  if (!tokenId || !licensee || !rights || !duration) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const issuedTime = Date.now();
  const expiryTime = issuedTime + duration * 60000;

  licenseData[tokenId] = { owner: userWallet, licensee, rights, issued: issuedTime, expiry: expiryTime };
  alert(`✅ License granted for Token ${tokenId} until ${new Date(expiryTime).toLocaleTimeString()}`);
}

function viewLicense() {
  const tokenId = document.getElementById("viewTokenId").value;
  const licenseList = document.getElementById("licenseList");
  licenseList.innerHTML = "";

  if (!tokenId) {
    alert("Please enter a Token ID!");
    return;
  }

  const data = licenseData[tokenId];
  if (!data) {
    licenseList.innerHTML = `<p>No license found for Token ${tokenId}</p>`;
    return;
  }

  const now = Date.now();
  const status = now > data.expiry ? "Expired" : "Active";

  licenseList.innerHTML = `
    <p><b>Token ID:</b> ${tokenId}</p>
    <p><b>Owner:</b> ${data.owner}</p>
    <p><b>Licensee:</b> ${data.licensee}</p>
    <p><b>Rights:</b> ${data.rights}</p>
    <p><b>Status:</b> ${status}</p>
    <p><b>Issued At:</b> ${new Date(data.issued).toLocaleTimeString()}</p>
    <p><b>Expiry:</b> ${new Date(data.expiry).toLocaleTimeString()}</p>
  `;
}

function logout() {
  localStorage.removeItem("userWallet");
  alert("Logged out successfully!");
  location.href = "index.html";
}

window.addEventListener("load", init);
