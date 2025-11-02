import { NFTStorage } from "nft.storage";

const nftStorageKey = "YOUR_NFT_STORAGE_API_KEY"; // Replace with your real API key
let userAddress = null;

// Connect MetaMask wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = accounts[0];
      document.getElementById("walletAddress").innerText = userAddress;
      alert("Wallet connected successfully!");
    } catch (error) {
      console.error("User rejected MetaMask connection:", error);
      alert("Connection rejected. Please allow MetaMask access.");
    }
  } else {
    alert("MetaMask not found. Please install MetaMask first.");
  }
}

// Mint NFT
async function mintNFT() {
  try {
    const file = document.querySelector("#nftFile").files[0];
    const name = document.querySelector("#nftName").value.trim();
    const description = document.querySelector("#nftDescription").value.trim();

    if (!file || !name || !description) {
      alert("Please fill all fields and choose a file before minting.");
      return;
    }

    const client = new NFTStorage({ token: nftStorageKey });

    // Upload file to NFT.Storage
    const cid = await client.storeBlob(file);
    console.log("NFT uploaded successfully. CID:", cid);

    const metadata = {
      name,
      description,
      image: `https://${cid}.ipfs.nftstorage.link/`,
      timestamp: new Date().toLocaleString(),
      owner: userAddress,
    };

    console.log("NFT Metadata:", metadata);

    // Display NFT in dashboard
    const dashboard = document.getElementById("nftDashboard");
    const nftCard = document.createElement("div");
    nftCard.className = "nft-card";
    nftCard.innerHTML = `
      <img src="${metadata.image}" alt="${metadata.name}" class="nft-image"/>
      <h3>${metadata.name}</h3>
      <p>${metadata.description}</p>
      <p><strong>Owner:</strong> ${metadata.owner}</p>
      <p><strong>Minted On:</strong> ${metadata.timestamp}</p>
      <a href="${metadata.image}" target="_blank">View on IPFS</a>
    `;
    dashboard.appendChild(nftCard);

    alert("NFT minted successfully! 🎉");
  } catch (error) {
    console.error("Error minting NFT:", error);
    alert("Error minting NFT: " + error.message);
  }
}

// Grant License
function grantLicense() {
  const licenseName = document.getElementById("licenseName").value;
  const licenseDuration = document.getElementById("licenseDuration").value;

  if (!licenseName || !licenseDuration) {
    alert("Please enter license details.");
    return;
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(licenseDuration));

  const licenseInfo = {
    name: licenseName,
    duration: licenseDuration,
    expiry: expiryDate.toLocaleDateString(),
  };

  const licenseContainer = document.getElementById("licenseDashboard");
  const licenseCard = document.createElement("div");
  licenseCard.className = "license-card";
  licenseCard.innerHTML = `
    <h3>${licenseInfo.name}</h3>
    <p>Duration: ${licenseInfo.duration} days</p>
    <p>Expiry Date: ${licenseInfo.expiry}</p>
  `;
  licenseContainer.appendChild(licenseCard);

  alert("License granted successfully!");
}

// Logout function
function logout() {
  userAddress = null;
  document.getElementById("walletAddress").innerText = "";
  document.getElementById("nftDashboard").innerHTML = "";
  document.getElementById("licenseDashboard").innerHTML = "";
  alert("You have been logged out.");
}

// Event Listeners
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("mintBtn").addEventListener("click", mintNFT);
document.getElementById("grantBtn").addEventListener("click", grantLicense);
document.getElementById("logoutBtn").addEventListener("click", logout);
