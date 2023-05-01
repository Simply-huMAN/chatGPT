// import fetch from "node-fetch";

const PORT = 8000;
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "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";

app.post("/completions", async (req, res) => {
  var character = req.body.character;
  var mood = req.body.mood;
  var expertise = req.body.expertise;
  var conversationStyle = req.body.conversationStyle;
  var temperature = req.body.temperature;
  mood =
    mood === "normal"
      ? ``
      : `Answer in a ${mood} way and use this as your personality.`;
  character =
    character === "normal" ? `` : `Try to respond like ${character} would.`;
  expertise =
    expertise === "normal"
      ? ``
      : `If you are an expert in ${expertise}, answer questions related to that field only. Otherwise, say "This is out of my area of expertise, ask me about ${expertise}.`;
  conversationStyle =
    conversationStyle === "normal"
      ? ``
      : `Answer the query in ${conversationStyle} manner`;
  temperature = (temperature - 1) / 4;
  console.log(req.body.character, req.body.mood, "\n");
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${character} ${mood} ${expertise} ${conversationStyle}`,
          // temperature: { temperature },
        },
        { role: "user", content: req.body.message },
      ],
      temperature: temperature,
      max_tokens: 100,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    if (data) console.log(data.choices[0].message.content);
    res.send(data);
  } catch (error) {
    console.error(error);
  }
});
console.log("hi");
app.listen(PORT, () => "Server is running on PORT " + PORT);
