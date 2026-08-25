const path = require("path");
const axios = require("axios");

require("dotenv").config({ path: path.join(__dirname, ".env") });


const { App } = require("@slack/bolt");

if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_APP_TOKEN) {
  throw new Error(
    "Missing Slack credentials. Set SLACK_BOT_TOKEN and SLACK_APP_TOKEN in .env."
  );
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/smile-bot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/smile-bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/smile-bot-compliment", async ({ ack, respond }) => {
  await ack();

  const compliments = [
   "You're doing an amazing job! 🌟",
    "Your creativity is seriously impressive! 🎨",
    "You've got this! Keep going! 💪",
    "You make things better just by being here! ✨",
    "Your hard work is paying off! 🚀",
    "You're capable of more than you realize! 🔥",
    "Keep being awesome! 😎",
    "Your ideas have real potential! 💡",
    "You're making progress, even when it doesn't feel like it! 🌱",
    "You've got a great mindset! 🧠",
    "Someone's gotta say it: you're pretty awesome. 😄",
    "Your persistence is something to be proud of! 🏆",
    "You're absolutely crushing it! 🚀",
    "Keep building, keep learning, keep smiling! 😊",
    "The world needs more people who keep trying like you do! 🌎"
  ];

  const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
  await respond({ text: randomCompliment });
}); 
app.command("/smile-bot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();  
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  try {
    console.log("Connecting to Slack..."); 
    await app.start();
    console.log("bot is running!");
  } catch (error) {   
    console.error("Failed to start the Slack bot:", error);
    process.exitCode = 1;
  }
})();