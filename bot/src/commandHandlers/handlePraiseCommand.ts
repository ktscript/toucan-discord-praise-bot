import { Message } from "discord.js";
import { discord } from "../utils/discordClient";
import fetchWalletConnection from "../utils/fetchWalletConnection";
import ifcPraise from "../utils/ifcPraise";
import parsePraise from "../utils/parsePraise";

/**
 * @description attempts to call the praise method from the ToucanPraiseToken contract onto the praisee
 * @param parsed the message parsed by discord-command-parser used for readonly operations
 * @param msg the message object from discord.js used to reply, etc.
 */
export const handlePraiseCommand = (
  parsed: any,
  msg: Message,
  clientUrl: string
) => {
  try {
    `${msg.author.username} (ID: ${msg.author.id}) wants to praise!`;
    msg.react("🌳");

    /**
     * Parse the praise
     */
    const praise: ifcPraise | null = parsePraise(parsed);
    if (!praise?.praiseTargets[0]) {
      msg.reply(
        "Praise couldn't be parsed." +
          "\n\n A valid praise would look like:" +
          "\n\n !praise @Alex Lazar for making this bot"
      );
      throw new Error("Praise couldn't be parsed!");
      return;
    }

    /**
     * Error message in case there are no praise targets
     */
    if (praise.praiseTargets.length === 0) {
      msg.reply(
        "Empty praise! Please tag someone in your praise (before the 'for' marker)." +
          "\n\n A valid praise would look like:" +
          "\n\n !praise @Alex Lazar for making this bot"
      );
      throw new Error("No praise target!");
      return;
    }

    /**
     * Check if user is trying to praise himself
     */
    praise.praiseTargets.map((praiseTarget) => {
      if (praiseTarget.id == msg.author.id) {
        msg.reply("Can't praise yourself!");
        throw new Error("Can't praise yourself!");
        return;
      }
    });

    /**
     * Check if the user that is trying to praise has his wallet connected
     */
    const praiserWalletConnection = async () =>
      await fetchWalletConnection(msg.author.id);
    if (!praiserWalletConnection) {
      msg.reply(
        `You need to connect your wallet before you can praise someone, go to ${clientUrl}`
      );
      throw new Error("Praiser doesn't have a wallet connection!");
      return;
    }

    // TODO: check praiseTargets' walletConnection(s)

    // TODO: have the !praise command call the praise method from the contract.

    /**
     * a nice success message explained who praised who and for what
     */
    const successMessage = `${
      msg.author
    } has praised ${praise.praiseTargets.map((praiseTarget, index) => {
      // TODO for some reason this returns a promise object WHYYYYYY??!?!?!?
      if (index !== 0) {
        return ` ${praiseTarget}`;
      }
      return praiseTarget;
    })} ${praise.reason || ""}`;
    console.log(successMessage);
    msg.reply(successMessage);
    return;
  } catch (error) {
    console.log(error);
  }
};
