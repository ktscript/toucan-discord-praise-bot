import { MessageArgumentReader, ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import { discord } from "./discordClient";
import ifcPraise from "./ifcPraise";

const parsePraise = (
  parsed: ParsedMessage<Message<boolean>>
): ifcPraise | null => {
  try {
    // @ts-ignore the reader exists, but discord-command-parser has an issue with this type
    const reader = parsed.reader;
    const praise: ifcPraise = { praiseTargets: [] };

    /**
     * loop over the parsed message, extract praise targets and praise reason
     */
    reader.args.some(() => {
      if (reader.getUserID(true)) {
        (async () => {
          const user = await discord.users.fetch(reader.getUserID());
          // TODO it can't push the user to the array for some reason
          praise.praiseTargets.push(user);
        })();
      }

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
