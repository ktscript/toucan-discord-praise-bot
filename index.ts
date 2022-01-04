import { Message } from "discord.js";
import { parse } from "discord-command-parser";
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

  /**
   * Example message: !praise @frankTurtle.crypto for the legendary BCT price bot here in discord
   * Example message: !praise @frankTurtle.crypto @toucan-praise-bot
   * Example message: !praise @frankTurtle.crypto & @toucan-praise-bot for doing good
   * Example message: !praise the team for doing good
   * Example message: !praise @everyone you know
   */
  if (parsed.command === "praise") {
    interface Praise {
      people: string[];
      message?: string;
    }
    const praise: Praise = { people: [] };
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
// TODO clean this mess up
// TODO store the validated praises
// TODO learn how to give Discord rewards

client.login(token);
