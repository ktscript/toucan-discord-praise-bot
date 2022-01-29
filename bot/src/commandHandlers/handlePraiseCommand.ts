import { ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import callPraise from "../utils/callPraise";
import fetchUserById from "../utils/discord/fetchUserByID";
import fetchWalletConnection from "../utils/fetchWalletConnection";
import ifcPraise from "../utils/discord/ifcPraise";
import parsePraise from "../utils/discord/parsePraise";

/**
 * @description attempts to call the praise method from the ToucanPraiseToken contract onto the praisee
 * @param parsed the message parsed by discord-command-parser used for readonly operations
 * @param msg the non-parsed message object, can be used to reply to the message
 */
export const handlePraiseCommand = async (
  parsed: ParsedMessage<Message<boolean>>,
  msg: Message,
  clientUrl: string
) => {
  try {
    `${msg.author.username} (ID: ${msg.author.id}) wants to praise!`;
    /**
     * the tree reaction show the user that the bot is processing his command
     */
    msg.react("🌳");

    /**
     * Prases and extracts the praise
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
      if (praiseTarget == msg.author.id) {
        msg.reply("Can't praise yourself!");
        throw new Error("Can't praise yourself!");
        return;
      }
    });

    /**
     * Check if the user that is trying to praise has his wallet connected
     */
    const praiserWalletConnection = await fetchWalletConnection(
      "discord",
      msg.author.id
    );
    if (!praiserWalletConnection) {
      msg.reply(
        `You need to connect your wallet before you can praise someone, go to ${clientUrl}`
      );
      throw new Error("Praiser doesn't have a wallet connection!");
      return;
    }

    /**
     * check praiseTargets' walletConnection(s), praise the ones that do, tell the ones that don't to connect
     */
    praise.praiseTargets.map(async (id) => {
      const praiseTargetWalletConnection = await fetchWalletConnection(
        "discord",
        id
      );
      const user = await fetchUserById(id);

      if (!praiseTargetWalletConnection) {
        msg.reply(
          `Praise target ${user} doesn't have a wallet connection! They should go to ${clientUrl} to connect.`
        );
        console.error(
          `Praise target ${user} doesn't have a wallet connection!`
        );
        return;
      }

      /**
       * this is the moment we interact with the contract to actually praise someone on the blockchain
       */
      const res = await callPraise(
        praiserWalletConnection,
        praiseTargetWalletConnection
      );

      if (res.status !== 1) {
        throw new Error(
          "Something bad might have happened when calling the praise contract method."
        );
      }

      /**
       * success message
       */
      const successMessage = `${msg.author} has praised ${user} ${
        praise.reason || ""
      }`;
      console.log(successMessage);
      msg.reply(`You successfully praised ${user}`);
    });

    return;
  } catch (error: any) {
    console.error(error);
    msg.reply(`An unexpected error occurred: ${error.message}`);
  }
};
