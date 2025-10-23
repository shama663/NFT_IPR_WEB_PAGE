document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById('connectMetaMaskBtn');
    const status = document.getElementById('metaMaskStatus');

    connectBtn.onclick = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const wallet = accounts[0];
                localStorage.setItem('wallet', wallet);
                window.location.href = 'login.html';
            } catch (err) {
                status.innerText = 'Connection rejected!';
            }
        } else {
            status.innerText = 'MetaMask not installed!';
        }
    };
});
