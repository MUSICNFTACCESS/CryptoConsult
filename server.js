const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    }, {
      headers: {
        "Authorization": \`Bearer \${OPENAI_API_KEY}\`,
        "Content-Type": "application/json"
      }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ response: "Error: CrimznBot is currently offline." });
  }
});

app.listen(PORT, () => console.log("Server is running on port", PORT));
