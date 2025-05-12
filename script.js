document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
  chatBox.innerHTML += `<div>> You: ${userMessage}</div>`;
  input.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    chatBox.innerHTML += `<div><strong>CrimznBot:</strong> ${data.reply}</div>`;
  } catch {
    chatBox.innerHTML += `<div><strong>CrimznBot:</strong> Error reaching server.</div>`;
  }
});

// Price fetch
async function getPrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
    const prices = await res.json();
    document.getElementById('prices').textContent =
      `BTC: $${prices.bitcoin.usd} | ETH: $${prices.ethereum.usd} | SOL: $${prices.solana.usd}`;
  } catch {
    document.getElementById('prices').textContent = 'Error loading prices';
  }
}
getPrices();
setInterval(getPrices, 30000);

// Enable music on first click
document.addEventListener('click', () => {
  const music = document.getElementById('bgmusic');
  if (music) music.play();
}, { once: true });
