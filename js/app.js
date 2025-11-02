let web3;
let nftContract;
let userWallet;
let currentTokenId = 0;
let licenseData = {};

const contractAddress = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await web3.eth.requestAccounts();
      userWallet = accounts[0];
      localStorage.setItem("userWallet", userWallet);
      document.getElementById("userWallet").innerText = `Wallet: ${userWallet}`;
    } catch (error) {
      alert("Please connect MetaMask to use the dApp");
      return;
    }
  } else {
    alert("MetaMask not detected!");
    return;
  }

  const response = await fetch("./abi/NFT_IPR.json");
  const abi = await response.json();
  nftContract = new web3.eth.Contract(abi, contractAddress);

  attachButtonEvents();
}

function attachButtonEvents() {
  document.getElementById("mintBtn").addEventListener("click", mintNFT);
  document.getElementById("grantBtn").addEventListener("click", grantLicense);
  document.getElementById("viewBtn").addEventListener("click", viewLicense);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

async function mintNFT() {
  currentTokenId++;
  alert(`🎉 NFT Minted Successfully!\nToken ID: ${currentTokenId}`);
}

async function grantLicense() {
  const tokenId = document.getElementById("tokenId").value;
  const licensee = document.getElementById("licensee").value;
  const rights = document.getElementById("rights").value;
  const duration = parseInt(document.getElementById("duration").value);

  if (!tokenId || !licensee || !rights || !duration) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  if (licenseData[tokenId] && licenseData[tokenId].expiry > Date.now()) {
    alert(
      `⚠️ Token ${tokenId} already has an active license until ${new Date(
        licenseData[tokenId].expiry
      ).toLocaleTimeString()}`
    );
    return;
  }

  const expiryTime = Date.now() + duration * 60000;
  licenseData[tokenId] = { licensee, rights, expiry: expiryTime };
  alert(
    `✅ License granted for Token ${tokenId}\nValid until: ${new Date(
      expiryTime
    ).toLocaleTimeString()}`
  );
}

function viewLicense() {
  const tokenId = document.getElementById("viewTokenId").value;
  if (!tokenId) {
    alert("Please enter Token ID!");
    return;
  }

  const data = licenseData[tokenId];
  if (!data) {
    document.getElementById(
      "licenseList"
    ).innerText = `No license found for Token ${tokenId}`;
    return;
  }

  const now = Date.now();
  const status = now > data.expiry ? "Expired" : "Active";
  document.getElementById(
    "licenseList"
  ).innerText = `Token ${tokenId} License:
Licensee: ${data.licensee}
Rights: ${data.rights}
Status: ${status}
Expiry: ${new Date(data.expiry).toLocaleTimeString()}`;
}

function logout() {
  localStorage.removeItem("userWallet");
  alert("Logged out successfully!");
  location.reload();
}

window.addEventListener("load", init);
