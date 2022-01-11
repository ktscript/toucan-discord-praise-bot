import { Message } from "discord.js";
import { parse } from "discord-command-parser";
import ifcPraise from "../utils/ifcPraise";
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
  partials: ["MESSAGE", "CHANNEL"],
});
const discordToken = process.env.DISCORD_TOKEN;
const PREFIX = "!";

client.on("ready", () => {
  console.log("Bot Online! Woohoo!");
});

client.on("messageCreate", (msg: Message) => {
  const parsed = parse(msg, "!");
  if (!parsed.success) return;
  const reader = parsed.reader;

  // TODO make a way to connect to wallet (Metamask + Walletconnect)
  if (parsed.command === "connect") {
    console.log("Connect attempted");
    msg.reply("You want to connect your wallet?");
  }

  if (parsed.command === "praise") {
    const praise: ifcPraise = { people: [] };
    reader.args.some(() => {
      const arg = reader.getString();

      if (!arg) return;

      if (arg && arg.includes("@")) {
        praise.people.push(arg);
      }
      if (arg === "for") {
        praise.message = "for " + reader.getRemaining();
        return true;
      }
    });

    if (!praise.message && praise.people.length === 0) {
      msg.reply(
        "Empty praise! Please tag someone or create a messaged that has the 'for' keyword before it."
      );
    } else {
      // TODO use the praise method from the contract upon the target's address
      // it's very important to handle the situation where we do not have the target's address
      console.log(praise);
      msg.reply("Thanks for praising!");
    }
  }
});

client.login(discordToken);
