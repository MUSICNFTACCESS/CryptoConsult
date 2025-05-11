onst fetch = require('node-fetch');

module.exports = async function (req, res) {
  try {
    const { message } = req.body;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: "You are CrimznBot, a crypto-savvy AI trained by Crimzn to guide users with insights, market commentary, and friendly advice. Always try to answer clearly and accurately. You're allowed to give price estimates but clarify they may be outdated unless real-time data is available.",
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, something went wrong.";

    res.json({ reply });
  } catch (error) {
    console.error('Error in chat.js:', error);
    res.status(500).json({ reply: "CrimznBot: I'm having trouble reaching the brain right now. Try again soon." });
  }
};
