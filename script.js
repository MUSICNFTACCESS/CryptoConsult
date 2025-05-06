document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.querySelector('#chat-form');
  const chatInput = chatForm.querySelector('input');
  const chatBox = document.querySelector('#chatbox');
  const pricesDiv = document.querySelector('#prices');

  async function getPrices() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
      const data = await res.json();
      pricesDiv.innerHTML = `
        BTC: $${data.bitcoin.usd.toLocaleString()} |
        ETH: $${data.ethereum.usd.toLocaleString()} |
        SOL: $${data.solana.usd.toLocaleString()}
      `;
    } catch (e) {
      pricesDiv.textContent = 'Error loading prices.';
    }
  }

  getPrices();
  setInterval(getPrices, 60000); // Update every 60 seconds

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatBox.innerHTML += `You: ${message}\n`;
    chatInput.value = '';

    try {
      const res = await fetch('https://crimznbot.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      chatBox.innerHTML += `CrimznBot: ${data.reply}\n\n`;
    } catch (err) {
      chatBox.innerHTML += 'CrimznBot: Error connecting to server.\n\n';
    }
  });
});
