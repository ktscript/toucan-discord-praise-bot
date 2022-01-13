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
const clientUrl = process.env.CLIENT_URL;

client.on("ready", () => {
  console.log("Bot Online! Woohoo!");
});

client.on("messageCreate", (msg: Message) => {
  const parsed = parse(msg, "!");
  if (!parsed.success) return;
  const reader = parsed.reader;

  /**
   * TODO make a way to connect to wallet (Metamask + Walletconnect)
   *
   * My basic idea of how I will do this?
   * 1. User uses the !connect command and gets send to a Next.js app
   * 2. User authenticates his wallet in the Next.js app
   * 3. Next.js app stores the link between the wallet address and the Discord ID in one of 2 ways:
   *    a. a Supabase dB
   *    b. a mapping within ToucanPraiseToken.sol
   * * Decided to use Supabase because it comes with a pre-made Discord auth making my life easier
   *
   * 4. An interval will be set to check each discord ID whether they have connected a wallet and how many ToucanPraiseTokens they have
   * 5. Based on what the check returns, we can take different actions like:
   *    a. Let non-connected people know they should connect
   *    b. Change their role/emoji/nickname based on their TPT (ToucanPraiseToken) balance
   *
   * Extras:
   *
   * - user should be able to manage his wallet connections from the Next.js app (change his wallet, etc)
   */

  if (parsed.command === "connect") {
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
      // TODO use the praise method from the contract upon the target's address
      // it's very important to handle the situation where we do not have the target's address
      console.log(praise);
      msg.reply("Thanks for praising!");
    }
  }
});

client.login(discordToken);
