import { Message } from "discord.js";
import { parse } from "discord-command-parser";
import { discord } from "./utils/discordClient";
import { supabase } from "./utils/supabaseClient";
import { handlePraiseCommand } from "./commandHandlers/handlePraiseCommand";
import discordToWalletConnection from "./utils/ifcDiscordtoWalletConnection";
import fetchWalletConnection from "./utils/fetchWalletConnection";
import handleConnectCommand from "./commandHandlers/handleConnectCommand";
import handleHelpCommand from "./commandHandlers/handleHelpCommand";
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
    handleHelpCommand(msg);
  }

  if (parsed.command === "connect") {
    handleConnectCommand(msg, clientUrl);
  }

  if (parsed.command === "praise") {
    handlePraiseCommand(parsed, msg, clientUrl);
  }
});

const discordToken: string = process.env.DISCORD_TOKEN || "";
discord.login(discordToken);
