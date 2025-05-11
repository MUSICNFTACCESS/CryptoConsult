// Tab logic
document.addEventListener('DOMContentLoaded', () => {
  const tabs = {
    'tab-bot': 'section-bot',
    'tab-portfolio': 'section-portfolio'
  };

  Object.keys(tabs).forEach(tabId => {
    document.getElementById(tabId).addEventListener('click', () => {
      // Update tab classes
      Object.keys(tabs).forEach(id => {
        document.getElementById(id).classList.remove('active');
        document.getElementById(tabs[id]).classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
      document.getElementById(tabs[tabId]).classList.add('active');
    });
  });

  // Load prices
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&t=' + Date.now())
    .then(res => res.json())
    .then(data => {
      document.getElementById('prices').innerText =
        `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum.usd} | SOL: $${data.solana.usd}`;
    })
    .catch(() => {
      document.getElementById('prices').innerText = 'Error loading prices';
    });
});

// Chat logic
document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
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
