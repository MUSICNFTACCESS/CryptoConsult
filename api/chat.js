const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getPricesString() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
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

  const messages = [
    {
      role: 'system',
      content: `You are CrimznBot, a GPT-4o powered crypto consultant built by Crimzn. Answer like ChatGPT would, but with a crypto edge. Use this if price data is requested:\n\n${prices}`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ reply: 'Error reaching server. Please try again shortly.' });
  }
});

module.exports = router;
// force redeploy
