document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.querySelector("#chat-form input");
  const message = input.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  const userMessage = document.createElement("div");
  userMessage.textContent = `You: ${message}`;
  chatbox.appendChild(userMessage);

  input.value = "";

  try {
    const response = await fetch("https://crimznbot.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    const botMessage = document.createElement("div");
    botMessage.textContent = `CrimznBot: ${data.reply}`;
    chatbox.appendChild(botMessage);
  } catch (err) {
    const error = document.createElement("div");
    error.textContent = "CrimznBot is currently unavailable.";
    chatbox.appendChild(error);
  }
});

async function updatePrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    const btc = data.bitcoin.usd.toLocaleString();
    const eth = data.ethereum.usd.toLocaleString();
    const sol = data.solana.usd.toLocaleString();
    document.getElementById("prices").textContent = `BTC: $${btc} | ETH: $${eth} | SOL: $${sol}`;
  } catch (err) {
    document.getElementById("prices").textContent = "Failed to load live prices.";
  }
}

updatePrices();
setInterval(updatePrices, 60000);
