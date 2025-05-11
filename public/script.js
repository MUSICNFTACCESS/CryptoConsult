document.addEventListener('DOMContentLoaded', () => {
  // === Live Price Fetcher ===
  function updatePrices() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&ts=' + Date.now())
      .then(res => res.json())
      .then(data => {
        const priceDiv = document.getElementById('prices');
        if (priceDiv) {
          priceDiv.innerText =
            `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum.usd} | SOL: $${data.solana.usd}`;
        }
      })
      .catch(() => {
        const priceDiv = document.getElementById('prices');
        if (priceDiv) {
          priceDiv.innerText = 'Error loading prices';
        }
      });
  }
  updatePrices();
  setInterval(updatePrices, 60000);

  // === CrimznBot Chat ===
  document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const input = document.querySelector('input');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    const chatBox = document.querySelector('#chatbox');
    chatBox.innerHTML = `<div>> You: ${userMessage}</div>`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      chatBox.innerHTML += `<div><strong>CrimznBot:</strong> ${data.reply}</div>`;
    } catch (error) {
      chatBox.innerHTML += `<div><strong>CrimznBot:</strong> Error reaching server.</div>`;
    }

    input.value = '';
  });
});
