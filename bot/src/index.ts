import { Message } from "discord.js";
import { parse } from "discord-command-parser";
import ifcPraise from "./utils/ifcPraise";
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
  partials: ["MESSAGE", "CHANNEL"],
});
const discordToken = process.env.DISCORD_TOKEN;
const PREFIX = "!";
const clientUrl = process.env.CLIENT_URL;

client.on("ready", () => {
  console.log("Bot Online! Woohoo!");
});

client.on("messageCreate", (msg: Message) => {
  const parsed = parse(msg, "!");
  if (!parsed.success) return;
  const reader = parsed.reader;

  /**
   * Now users can connect their Metamask wallets.
   *
   * TODO: We need a way to regularly check each discord ID
   * whether they have connected a wallet and how many ToucanPraiseTokens they have. This may be resource-intensive
   * and I'm wondering if there is a better way.
   *
   *
   * TODO: Based on what the check returns, we can take different actions like:
   *    a. Let non-connected people know they should connect
   *    b. Change their role/emoji/nickname based on their TPT (ToucanPraiseToken) balance
   *
   * TODO: have the !praise command call the praise method from the contract.
   * It's very important to handle the situations where
   * - we do not have the target's address;
   * - it was a praise without a target.
   */

  if (parsed.command === "connect") {
    // TODO: handle situation where user already connected his wallet
    console.log("Connect attempted");
    msg.reply(`You want to connect your wallet? Go to ${clientUrl}`);
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
      console.log(praise);
      msg.reply("Thanks for praising!");
    }
  }
});

client.login(discordToken);
