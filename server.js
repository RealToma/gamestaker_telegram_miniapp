require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
const API_PORT = process.env.PORT || 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(logger("dev"));

http.listen(API_PORT, () => {
  console.log(`LISTENING ON PORT ${API_PORT}`);
});

const { Bot, InlineKeyboard } = require("grammy");
const botToken = process.env.BOT_TOKEN;
const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  const userid = ctx.from.username; // Get the Telegram user ID
  console.log("userid:", userid);
  const receiveid = ctx.match;
  console.log("receiveid:", receiveid);

  const menus = new InlineKeyboard().webApp(
    "Click to get started!",
    "https://gamestaker-euro2024.vercel.app/"
  );

  await ctx.replyWithPhoto(
    "https://ipfs.io/ipfs/QmTvM9LXzgCuFTrWzJCHVFiMwUpu3rctYB6pt8nMadZoos?format=jpg&name=large",
    {
      reply_markup: menus,
      parse_mode: "HTML",
      caption: `Hello, @${userid}! Welcome to gamestaker.`,
    }
  );
});

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  switch (data) {
    case "howToEarn":
      const menus = new InlineKeyboard().webApp(
        "Click to get started!",
        "https://gamestaker-euro2024.vercel.app/"
      );
      await ctx.reply("Hello, this is just example.", {
        reply_markup: menus,
        parse_mode: "HTML",
      });
    default:
      break;
  }
});

(async () => {
  await bot.api.deleteWebhook();
  bot.start();
})();
