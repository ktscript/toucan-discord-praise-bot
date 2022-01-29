import { ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import ifcPraise from "./ifcPraise";

/**
 *
 * @param parsed is the discord-command-parser 'parsed' message that we are trying to further parse to extract what's needed
 * @returns a Praise object which will contain praiseTargets and reason for the praise
 */
const parsePraise = (
  parsed: ParsedMessage<Message<boolean>>
): ifcPraise | null => {
  try {
    // @ts-ignore the reader exists, but discord-command-parser has an issue with this type
    const reader = parsed.reader;
    const praise: ifcPraise = { praiseTargets: [] };

    /**
     * loop over the parsed message, extract praise targets' Discord IDs and the praise reason
     */
    reader.args.some((element: string, index: number) => {
      /**
       * find if the argument is a discord ID and store it in the praise
       */
      if (reader.getUserID(true)) {
        praise.praiseTargets.push(reader.getUserID(true));
      }

      const arg = reader.getString();

      if (!arg) return true;

      /**
       * check for the "for" keyword and store the remaining text as a reason
       */
      if (arg === "for") {
        praise.reason = "for " + reader.getRemaining();
        return true;
      }
    });

    return praise;
  } catch (error) {
    console.log("Error when parsing praise message", error);
    return null;
  }
};

export default parsePraise;
