document.addEventListener("DOMContentLoaded", async () => {
  const priceDiv = document.getElementById("prices");

  try {
    const [btc, eth, sol] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then(res => res.json()),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd").then(res => res.json()),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(res => res.json())
    ]);

priceDiv.innerHTML = `BTC: $${btc.bitcoin.usd.toLocaleString()} | ETH: $${eth.ethereum.usd.toLocaleString()} | SOL: $${sol.solana.usd.toLocaleString()}`;
