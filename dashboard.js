import { NFTStorage, File } from "nft.storage";

const nftStorageKey = "17a8d371.231ba3f3169046c5842c11dab5f73b26"; // Replace with your real key
let userAddress = null;

// Connect MetaMask
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

    const metadata = await client.store({
      name,
      description,
      image: new File([file], file.name, { type: file.type }),
      properties: {
        owner: userAddress,
        mintedAt: new Date().toLocaleString(),
      },
    });

    console.log("NFT Metadata stored at:", metadata.url);

    const dashboard = document.getElementById("nftDashboard");
    const nftCard = document.createElement("div");
    nftCard.className = "nft-card";
    nftCard.innerHTML = `
      <h3>${name}</h3>
      <p>${description}</p>
      <p><strong>Owner:</strong> ${userAddress}</p>
      <p><strong>Minted On:</strong> ${new Date().toLocaleString()}</p>
      <a href="${metadata.url}" target="_blank">View on IPFS</a>
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

  const licenseContainer = document.getElementById("licenseDashboard");
  const licenseCard = document.createElement("div");
  licenseCard.className = "license-card";
  licenseCard.innerHTML = `
    <h4>${licenseName}</h4>
    <p>Duration: ${licenseDuration} days</p>
    <p>Expiry Date: ${expiryDate.toLocaleDateString()}</p>
  `;
  licenseContainer.appendChild(licenseCard);

  alert("License granted successfully!");
}

// Logout
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
