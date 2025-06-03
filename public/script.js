let questionCount = 0;
const maxFreeQuestions = 3;

const BACKEND_URL = "https://cryptoconsult-1.onrender.com";

// 🔁 Fetch live crypto prices every 60 seconds
async function fetchPrices() {
  try {
    const res = await fetch(`${BACKEND_URL}/price`);
    const data = await res.json();
    document.getElementById("btc-price").textContent = `$${data.bitcoin} USD`;
    document.getElementById("eth-price").textContent = `$${data.ethereum} USD`;
    document.getElementById("sol-price").textContent = `$${data.solana} USD`;
  } catch (err) {
    document.getElementById("btc-price").textContent = "Error USD";
    document.getElementById("eth-price").textContent = "Error USD";
    document.getElementById("sol-price").textContent = "Error USD";
  }
}

// 🤖 Handle chat interaction and question limits
async function sendMessage() {
  const input = document.getElementById("user-input");
  const output = document.getElementById("chat-output");
  const paywall = document.getElementById("paywall");
  const message = input.value.trim();

  if (!message) return;

  if (questionCount >= maxFreeQuestions) {
    paywall.style.display = "block";
    input.disabled = true;
    document.getElementById("send-button").disabled = true;
    return;
  }

  output.innerHTML += `<p style="color:#f7931a;"><strong>You:</strong> ${message}</p>`;
  input.value = "";

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    output.innerHTML += `<p style="color:#00ff00;"><strong>CrimznBot:</strong> ${data.reply}</p>`;
    questionCount++;
  } catch (err) {
    output.innerHTML += `<p style="color:red;"><strong>Error:</strong> Please try again</p>`;
  }
}

window.onload = fetchPrices;
setInterval(fetchPrices, 60000); // every 60 seconds
