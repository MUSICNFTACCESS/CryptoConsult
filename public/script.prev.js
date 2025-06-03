let questionCount = 0;
const maxFreeQuestions = 3;

async function sendMessage() {
  const input = document.getElementById("user-input");
  const output = document.getElementById("chat-output");
  const paywall = document.getElementById("paywall");
  const message = input.value.trim();
  if (!message) return;

  if (questionCount >= maxFreeQuestions) {
    paywall.style.display = "block";
    input.disabled = true;
    return;
  }

  output.innerHTML += `<p style="color:#f7931a;"><strong>You:</strong> ${message}</p>`;
  input.value = "";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    output.innerHTML += `<p style="color:#00ff00;"><strong>CrimznBot:</strong> ${data.reply}</p>`;
    questionCount++;
  } catch (err) {
    output.innerHTML += `<p style="color:red;"><strong>Error:</strong> Something went wrong.</p>`;
  }
}

async function fetchPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    document.getElementById("btc-price").textContent = `$${data.bitcoin.usd}`;
    document.getElementById("eth-price").textContent = `$${data.ethereum.usd}`;
    document.getElementById("sol-price").textContent = `$${data.solana.usd}`;
  } catch (err) {
    document.getElementById("btc-price").textContent = "Error";
    document.getElementById("eth-price").textContent = "Error";
    document.getElementById("sol-price").textContent = "Error";
  }
}

window.onload = fetchPrices;
