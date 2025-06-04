const express = require("express");
const app = express();
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

app.get("/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await response.json();
    res.json({
      btc: data?.bitcoin?.usd || "Error",
      eth: data?.ethereum?.usd || "Error",
      sol: data?.solana?.usd || "Error"
    });
  } catch (err) {
    res.status(500).json({ error: "CoinGecko fetch failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CrimznBot running on port ${PORT}`);
});
