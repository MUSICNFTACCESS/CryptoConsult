const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getPricesString() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&t=' + Date.now());
    const data = await res.json();
    return `Live prices:
- Bitcoin: 22879{data.bitcoin.usd}
- Ethereum: 22879{data.ethereum.usd}
- Solana: 22879{data.solana.usd}`;
  } catch (e) {
    return 'Live prices unavailable right now.';
  }
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const prices = await getPricesString();

  const basePrompt = "You are CrimznBot, a GPT-4o powered crypto consultant built by Crimzn. Answer just like ChatGPT would, but with extra knowledge and clarity on crypto topics when relevant.";

  const messages = [
    { role: 'system', content: basePrompt },
    { role: 'user', content: userMessage }
  ];

  if (
    userMessage.toLowerCase().includes("price") ||
    userMessage.toLowerCase().includes("bitcoin") ||
    userMessage.toLowerCase().includes("btc") ||
    userMessage.toLowerCase().includes("eth") ||
    userMessage.toLowerCase().includes("sol")
  ) {
    messages.unshift({
      role: 'system',
      content: `Live market snapshot:\n${prices}`
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ reply: 'Error reaching server. Please try again shortly.' });
  }
});

module.exports = router;
