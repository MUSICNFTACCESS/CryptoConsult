// Handle CrimznBot chat
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
      body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    chatBox.innerHTML += `<div><b>CrimznBot:</b> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `<div><b>CrimznBot:</b> Error reaching server.</div>`;
  }
});

// Fetch and display BTC, ETH, SOL prices
async function fetchPrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
    const data = await res.json();
    document.getElementById('btcPrice').innerText = `BTC: $${data.bitcoin.usd}`;
    document.getElementById('ethPrice').innerText = `ETH: $${data.ethereum.usd}`;
    document.getElementById('solPrice').innerText = `SOL: $${data.solana.usd}`;
  } catch (err) {
    console.error('Price fetch failed:', err);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000); // update every 60 seconds

