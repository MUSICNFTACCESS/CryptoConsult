const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('CrimznBot backend is live!');
});

app.post('/chat', async (req, res) => {
  const message = req.body.message;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from CrimznBot.' });
  }
});

app.listen(PORT, () => {
  console.log(`CrimznBot is running on port ${PORT}`);
});
