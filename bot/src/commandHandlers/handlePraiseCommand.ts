import { Message } from "discord.js";
import ifcPraise from "../utils/ifcPraise";

/**
 * @description attempts to call the praise method from the ToucanPraiseToken contract onto the praisee
 * @param parsed the message parsed by discord-command-parser used for readonly operations
 * @param msg the message object from discord.js used to reply, etc.
 */
export const handlePraiseCommand = (parsed: any, msg: Message) => {
  try {
    `${msg.author.username} (ID: ${msg.author.id}) want to praise!`;
    msg.react("🌳");
    const reader = parsed.reader;
    const praise: ifcPraise = { praiseTargets: [] };

    /**
     * loop over the parsed message, extract praise targets and praise reason
     */
    reader.args.some(() => {
      const arg = reader.getString();

      if (!arg) throw new Error("Empty message");

      if (arg && arg.includes("@")) {
        praise.praiseTargets.push(arg);
      }
      if (arg === "for") {
        praise.reason = "for " + reader.getRemaining();
        return true;
      }
    });

    /**
     * error message in case there are no praise targets
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

    // TODO: check praisers walletConnection

    // TODO: check praiseTargets' walletConnection(s)

    // TODO: have the !praise command call the praise method from the contract.

    /**
     * a nice success message explained who praised who and for what
     */
    const successMessage = `${
      msg.author
    } has praised ${praise.praiseTargets.map((praiseTarget, index) => {
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
