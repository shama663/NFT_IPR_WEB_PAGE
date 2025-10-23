document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById('loginBtn');
    const walletInput = document.getElementById('walletAddress');
    const passwordInput = document.getElementById('password');

    loginBtn.onclick = () => {
        const wallet = walletInput.value.trim();
        const password = passwordInput.value.trim();

        if (wallet && password) {
            localStorage.setItem('wallet', wallet);
            window.location.href = 'dashboard.html';
        } else {
            alert('Please enter wallet address and password');
        }
    };
});
