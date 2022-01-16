import { Message } from "discord.js";
import ifcPraise from "./ifcPraise";

/**
 * TODO: have the !praise command call the praise method from the contract.
 * It's important to handle the situations where
 * - we do not have the target's address;
 * - it was a praise without a target.
 *
 * @description attempts to call the praise method from the ToucanPraiseToken contract onto the praisee
 * @param parsed the message parsed by discord-command-parser used for readonly operations
 * @param msg the message object from discord.js used to reply, etc.
 */
export const handlePraiseCommand = (parsed: any, msg: Message) => {
  try {
    const reader = parsed.reader;
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
      msg.react("🌳");
    }
  } catch (error) {
    console.log(error);
  }
};
