let web3;
let nftContract;
let userWallet;
let currentTokenId = 0;

const contractAddress = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";
const nftStorageApiKey = "17a8d371.231ba3f3169046c5842c11dab5f73b26"; // 💖 Replace with your NFT.Storage API key
const nftStorageEndpoint = "https://api.nft.storage/upload";

document.addEventListener("DOMContentLoaded", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        userWallet = accounts[0];
        document.getElementById('userWallet').innerText = `Wallet: ${userWallet}`;
    } else {
        alert("Please install MetaMask to use this DApp");
        return;
    }

    const response = await fetch('./abi/NFT_IPR.json');
    const abi = await response.json();
    nftContract = new web3.eth.Contract(abi, contractAddress);

    attachButtonEvents();
});

function attachButtonEvents() {
    document.getElementById('mintBtn').onclick = mintNFT;
    document.getElementById('grantBtn').onclick = grantLicense;
    document.getElementById('viewBtn').onclick = viewLicense;
    document.getElementById('logoutBtn').onclick = logout;
}

async function mintNFT() {
    const name = document.getElementById('nftName').value;
    const description = document.getElementById('nftDescription').value;
    const fileInput = document.getElementById('nftImage');
    const file = fileInput.files[0];

    if (!name || !description || !file) {
        alert("Please fill all NFT details and upload an image");
        return;
    }

    try {
        const metadata = await uploadToNFTStorage(name, description, file);
        currentTokenId++;

        await nftContract.methods.mintNFT(userWallet, metadata.url).send({ from: userWallet });
        alert(`✅ NFT Minted!\nToken ID: ${currentTokenId}\nIPFS Metadata: ${metadata.url}`);
    } catch (err) {
        console.error(err);
        alert("❌ Error minting NFT: " + err.message);
    }
}

async function uploadToNFTStorage(name, description, file) {
    const formData = new FormData();
    formData.append("file", file);

    const imageResponse = await fetch(nftStorageEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${nftStorageApiKey}` },
        body: formData
    });
    const imageData = await imageResponse.json();
    const imageUrl = `ipfs://${imageData.value.cid}`;

    const metadata = {
        name,
        description,
        image: imageUrl,
        creator: userWallet,
        createdAt: new Date().toISOString()
    };

    const metaResponse = await fetch(nftStorageEndpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${nftStorageApiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(metadata)
    });

    const metaData = await metaResponse.json();
    const metadataUrl = `ipfs://${metaData.value.cid}`;
    return { url: metadataUrl };
}

let licenseData = {};

async function grantLicense() {
    const tokenId = document.getElementById('tokenId').value;
    const licensee = document.getElementById('licensee').value;
    const rights = document.getElementById('rights').value;
    const duration = parseInt(document.getElementById('duration').value);

    if (!tokenId || !licensee || !rights || !duration) {
        alert("Please fill all fields");
        return;
    }

    if (licenseData[tokenId] && licenseData[tokenId].expiry > Date.now()) {
        alert(`Token ${tokenId} already has an active license until ${new Date(licenseData[tokenId].expiry).toLocaleTimeString()}`);
        return;
    }

    const expiryTime = Date.now() + duration * 60000;
    licenseData[tokenId] = { licensee, rights, expiry: expiryTime };

    alert(`✅ License granted for Token ${tokenId} until ${new Date(expiryTime).toLocaleTimeString()}`);
}

function viewLicense() {
    const tokenId = document.getElementById('viewTokenId').value;
    if (!tokenId) {
        alert("Enter Token ID");
        return;
    }

    const data = licenseData[tokenId];
    if (!data) {
        document.getElementById('licenseList').innerText = `No license found for Token ${tokenId}`;
        return;
    }

    const status = Date.now() > data.expiry ? "Expired" : "Active";
    document.getElementById('licenseList').innerText = `
Token ${tokenId} License:
Licensee: ${data.licensee}
Rights: ${data.rights}
Status: ${status}
Expiry: ${new Date(data.expiry).toLocaleTimeString()}
    `;
}

function logout() {
    localStorage.clear();
    alert("Logged out!");
    window.location.href = "login.html";
}
