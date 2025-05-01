const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("CrimznBot backend is running!");
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  try {
    const { Configuration, OpenAIApi } = require("openai");
console.log("Loaded OpenAI key:", process.env.OPENAI_API_KEY ? "✅ Present" : "❌ Missing");
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error reaching CrimznBot." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
