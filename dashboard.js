document.addEventListener("DOMContentLoaded", () => {
    const userWallet = document.getElementById('userWallet');
    const mintBtn = document.getElementById('mintBtn');
    const grantBtn = document.getElementById('grantBtn');
    const viewBtn = document.getElementById('viewBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const licenseList = document.getElementById('licenseList');

    const wallet = localStorage.getItem('wallet');
    if (!wallet) {
        window.location.href = 'login.html';
        return;
    }
    userWallet.innerText = 'Wallet: ' + wallet;

    if (!localStorage.getItem('tokens')) localStorage.setItem('tokens', JSON.stringify([]));
    if (!localStorage.getItem('licenses')) localStorage.setItem('licenses', JSON.stringify([]));

    let tokens = JSON.parse(localStorage.getItem('tokens'));
    let licenses = JSON.parse(localStorage.getItem('licenses'));

    mintBtn.onclick = () => {
        const nextId = tokens.length + 1;
        if (tokens.includes(nextId)) {
            alert(`NFT ${nextId} already minted`);
            return;
        }
        tokens.push(nextId);
        localStorage.setItem('tokens', JSON.stringify(tokens));
        alert(`NFT ${nextId} minted successfully`);
    };

    grantBtn.onclick = () => {
        const tokenId = parseInt(document.getElementById('tokenId').value);
        const licensee = document.getElementById('licensee').value;
        const rights = document.getElementById('rights').value;
        const duration = parseInt(document.getElementById('duration').value);

        if (!tokens.includes(tokenId)) {
            alert(`Token ${tokenId} not minted yet`);
            return;
        }

        const existing = licenses.find(l => l.tokenId === tokenId && l.expiry > Date.now());
        if (existing) {
            alert(`Token ${tokenId} already has an active license until ${new Date(existing.expiry).toLocaleTimeString()}`);
            return;
        }

        const expiry = Date.now() + duration * 60000;
        licenses.push({ tokenId, licensee, rights, expiry });
        localStorage.setItem('licenses', JSON.stringify(licenses));
        alert(`License granted for Token ${tokenId} until ${new Date(expiry).toLocaleTimeString()}`);
    };

    viewBtn.onclick = () => {
        const tokenId = parseInt(document.getElementById('viewTokenId').value);
        const filtered = licenses.filter(l => l.tokenId === tokenId);
        licenseList.innerHTML = '';
        if (filtered.length === 0) {
            licenseList.innerHTML = `No licenses for token ${tokenId}`;
            return;
        }
        filtered.forEach(l => {
            const status = l.expiry > Date.now() ? 'Active' : 'Expired';
            const time = new Date(l.expiry).toLocaleTimeString();
            licenseList.innerHTML += `<p>Licensee: ${l.licensee}, Rights: ${l.rights}, Status: ${status}, Expires at: ${time}</p>`;
        });
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem('wallet');
        localStorage.removeItem('tokens');
        localStorage.removeItem('licenses');
        window.location.href = 'login.html';
    };
});
