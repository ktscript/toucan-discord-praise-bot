import { Message } from "discord.js";
import { parse } from "discord-command-parser";
import ifcPraise from "../utils/ifcPraise";
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
  partials: ["MESSAGE", "CHANNEL"],
});
const token = process.env.TOKEN;
const PREFIX = "!";

client.on("ready", () => {
  console.log("Bot Online! Woohoo!");
});

client.on("messageCreate", (msg: Message) => {
  const parsed = parse(msg, "!");
  if (!parsed.success) return;
  const reader = parsed.reader;

  if (parsed.command === "praise") {
    const praise: ifcPraise = { people: [] };
    reader.args.some(() => {
      const arg = reader.getString();
      console.log(arg);

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
      console.log(praise);
      msg.reply("Thanks for praising!");
    }
  }
});

// the basic gist is done, but there's still stuff to do here
// TODO use collab.land to mint tokens & send them to the praised user's address

client.login(token);
// TODO make a PraiseToken ERC-20 that will be used when praised people.
// and, the bot, when someone owns at least one PraiseToken will have a nice nickname or something
