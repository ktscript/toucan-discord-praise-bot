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

client.login(discordToken);
// TODO make this bot send ToucanPraiseToken to the praised person

/**
 * My discord bot can parse the “!praise @alex for making a bot” command just fine.
 *
 * I’ve made a ERC20 token (deployed on Rinkeby) which I have called TPT (ToucanPraiseToken).
 *
 * I've set up collab.land such that it knows when someone has TPT in their wallet.
 *
 * It will assign users a “praised” role if the have 1-5 TPTs and a”superPraised” role
 * if the have more than 5. This also works just fine.
 *
 * The only problem is: how do I actually send tokens from the discord bot to the user?!?
 *
 * Collab.land doesn’t really allow me to transfer TPT from their bot,
 * nor can it share access to the wallet with my bot so that I can write code to transfer TPT.
 *
 * I could probably have my Discord bot also ask the user to login with their Metamask / other wallet.
 *
 * But that's one extra step the user needs to go through and it will be annoying for users.
 *
 * Not to mention, that:
 *
 * 1. what if users login with different wallets for the 2 bots by mistake? that could be an issue
 *
 * 2. I’d need to make auth option for all the options collab.land has, which is quite a few. That’s a lot
 * of work which we may not want to maintain long-term.
 *
 * Lastly, if I could, I would prefer that users be giving TPTs (praise tokens) from a central place of ours.
 * It wouldn’t incentivise praising if people had to spend their praise tokens.
 *
 * Not weirdly at all, describing the issue like this made me realise I may not need
 * access to anyone’s wallet in my bot. I just need the bot to transfer TPTs
 * from the initial supply or mint when needed.
 *
 * Well, actually, even with this solution I still need
 * to know where to transfer the tokens. So I do need read-only
 * access to the user’s wallet.
 */
