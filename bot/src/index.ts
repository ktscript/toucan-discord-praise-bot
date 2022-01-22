import { Message, User } from "discord.js";
import { parse, ParsedMessage } from "discord-command-parser";
import { discord } from "./utils/discordClient";
import { handlePraiseCommand } from "./commandHandlers/handlePraiseCommand";
import handleConnectCommand from "./commandHandlers/handleConnectCommand";
import handleHelpCommand from "./commandHandlers/handleHelpCommand";
import fetchWalletConnection from "./utils/fetchWalletConnection";
require("dotenv").config();

const PREFIX = "!";
const clientUrl: string = process.env.CLIENT_URL || "";

discord.on("ready", () => {
  console.log("Bot Online! Woohooo!");
});

/**
 * I had a slight fear with this interval process, that it may be too resource-intensive
 * since it will run a Supabase query and potentially a read-only smart contract method for all server users.
 * But, at the current size of the server (400 something ppl) and assuming not all ppl will actually use TPT,
 * I think we'll be fine.
 */
setInterval(async () => {
  /**
   * calling this so the interval doesn't actually do anything for now (until I make the fetchTptBalance() function
   * and I test it)
   */
  return;
  /**
   * this runs through every user that we have connected to our server
   */
  discord.users.forEach(async (user: User) => {
    /**
     * it checks if user has connected their wallet yet and skips him if not
     */
    const walletConnection = await fetchWalletConnection(user.id);
    if (!walletConnection) return;

    /**
     * if the user has a wallet connected, we need to check his TPT balance
     */
    const balance = await fetchTptBalance(walletConnection.wallet_address);

    /**
     * and this is the point where we can give him roles, nicknames and other rewards for having a certain TPT balance
     */
    if (balance > 100) {
      console.log("This user has good reputation");
    }
  });
}, 1000 * 60 * 60 * 24); // the interval runs once a day, I don't think we need to check ppl's balances much more often than this

/**
 * TODO: a function that fetches someone TPT balance
 * @param wallet_address the address that we want to check the TPT balance for
 */
const fetchTptBalance = async (wallet_address: string) => {
  throw new Error("Function not implemented.");
};

discord.on("messageCreate", (msg: Message) => {
  /**
   * every time a message is created we will use the discord-command-parser library to help parsing the message
   */
  const parsed: ParsedMessage<Message<boolean>> = parse(msg, PREFIX);
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
