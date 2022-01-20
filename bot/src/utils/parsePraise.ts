import { ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import ifcPraise from "./ifcPraise";

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
      if (reader.getUserID(true)) {
        praise.praiseTargets.push(reader.getUserID(true));
      }

      // below here is good
      const arg = reader.getString();

      if (!arg) return true;

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
