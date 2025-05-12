document.querySelector('#chat-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
  chatBox.innerHTML += `> You: ${userMessage}\n`;
  input.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    chatBox.innerHTML += `CrimznBot: ${data.reply.trim()}\n\n`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch {
    chatBox.innerHTML += `CrimznBot: Error reaching server.\n\n`;
  }
});

// Live price display
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

// Play music on first click
document.addEventListener('click', () => {
  const music = document.getElementById('bgmusic');
  if (music) {
    music.loop = true;
    music.play().catch(() => {});
  }
}, { once: true });
