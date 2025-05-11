// Fetch and update live prices
async function loadPrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&t=' + Date.now());
    const data = await res.json();
    const pricesDiv = document.getElementById('prices');
    pricesDiv.innerText = `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum.usd} | SOL: $${data.solana.usd}`;
  } catch (err) {
    document.getElementById('prices').innerText = 'Error loading prices';
    console.error('Price load failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadPrices);

document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
  if (!chatBox) {
    console.error('chatbox element not found');
    return;
  }

  // Clear previous message
  chatBox.innerHTML = '';
  chatBox.innerHTML += `<div>> You: ${userMessage}</div>`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    chatBox.innerHTML += `<div><strong>CrimznBot:</strong> ${data.reply}</div>`;
  } catch (error) {
    chatBox.innerHTML += '<div><strong>CrimznBot:</strong> Error reaching server.</div>';
  }

  input.value = '';
});
