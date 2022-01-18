import { Message } from "discord.js";
import { parse } from "discord-command-parser";
import { discord } from "./utils/discordClient";
import { supabase } from "./utils/supabaseClient";
import { handlePraiseCommand } from "./commandHandlers/handlePraiseCommand";
require("dotenv").config();

const PREFIX = "!";
const clientUrl: string = process.env.CLIENT_URL || "";

discord.on("ready", () => {
  console.log("Bot Online! Woohooo!");
});

/**
 * TODO: We need a way to regularly check each discord ID for
 * whether they have connected a wallet and how many ToucanPraiseTokens they have.
 * This may be resource-intensive and I'm wondering if there is a better way.
 * Based on their balance you can assign a role. If they haven't connected yet, let them know.
 */

discord.on("messageCreate", (msg: Message) => {
  const parsed = parse(msg, PREFIX);
  if (!parsed.success) return;

  if (parsed.command === "help") {
    console.log(`${msg.author} needs help!`);
    msg.react("🌳");
    msg.reply(
      `Hey there, I'm the Praise Bot. Here's a list of the commands that you can use: ` +
        `\n\n- "!connect" to connect your discord & wallet to this bot so you can praise & be praised` +
        `\n\n- "!profile" will let you know if your discord or wallet are connected to the bot` +
        `\n\n- "!praise @john.appleseed for [insert reason]" to praise someone with the reason for the praise. ` +
        `It's very important to tag them before stating the reason. Stating a reason is optional, ` +
        `but if you do, you have to mark it by using the "for" keyword before stating the reason.` +
        `\n\n Those are all the commands. It's important to note that the amount of TPT the person you praise ` +
        `receives is calculated based on how much TPT you have yourself. In this way, TPT acts like reputation.`
    );
  }

  if (parsed.command === "connect") {
    // TODO: handle situation where user already connected his wallet
    console.log(`${msg.author} requested to connect!`);
    msg.react("🌳");
    if ("discord and wallet") {
      msg.reply(
        `You are already connected with both your discord and wallet. But you can manage your profile here ${clientUrl}`
      );
    }
    if ("discord, but no wallet") {
      msg.reply(
        `You have connected your discord already, but not your wallet. Go to ${clientUrl}`
      );
    }

    msg.reply(`You want to connect your wallet? Go to ${clientUrl}`);
  }

  if (parsed.command === "profile") {
    // TODO: tell user if he is connected (just discord, both, or neither)
    console.log(`Profile requested for ${msg.author}`);
    msg.react("🌳");
    if ("discord connected")
      msg.reply(
        `Your discord is connected, but you forgot to connect your wallet. Go to ${clientUrl} to do it.`
      );

    if ("wallet connected")
      msg.reply(
        `You are happily connected with both your discord and your wallet. You can go to ${clientUrl} to change your wallet.`
      );

    if ("no connection")
      msg.reply(
        `We have nothin on you. Go to ${clientUrl} to connect your discord and wallet.`
      );
  }

  if (parsed.command === "praise") {
    handlePraiseCommand(parsed, msg);
  }
});

const discordToken: string = process.env.DISCORD_TOKEN || "";
discord.login(discordToken);
