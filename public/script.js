document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById("chat-log");
  const input = document.querySelector("input");
  const sendButton = document.querySelector("button");

  async function fetchPrices() {
    try {
      const res = await fetch("/prices");
      const data = await res.json();

      document.getElementById("btc-price").textContent = `BTC: $${data.btc} USD`;
      document.getElementById("eth-price").textContent = `ETH: $${data.eth} USD`;
      document.getElementById("sol-price").textContent = `SOL: $${data.sol} USD`;
    } catch (err) {
      document.getElementById("btc-price").textContent = "BTC: Error USD USD";
      document.getElementById("eth-price").textContent = "ETH: Error USD USD";
      document.getElementById("sol-price").textContent = "SOL: Error USD USD";
    }
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    chatLog.innerHTML = `<span style="color: orange;">You:</span> ${message}`;
    input.value = "Loading...";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      });
      const data = await res.json();
      chatLog.innerHTML += `<br><span style="color: lime;">CrimznBot:</span> ${data.answer}`;
    } catch (err) {
      chatLog.innerHTML += `<br><span style="color: red;">Error talking to CrimznBot.</span>`;
    }

    input.value = "";
  }

  sendButton.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  fetchPrices();
});
