import { discord } from "./discordClient";
import ifcPraise from "./ifcPraise";

const parsePraise = (parsed: any): ifcPraise | null => {
  try {
    const reader = parsed.reader;
    const praise: ifcPraise = { praiseTargets: [] };

    /**
     * loop over the parsed message, extract praise targets and praise reason
     */
    reader.args.some(() => {
      if (reader.getUserID(true)) {
        (async () => {
          const user = await discord.users.fetch(reader.getUserID());
          console.log("user before pushing", user);
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

    console.log(praise);
    return praise;
  } catch (error) {
    console.log("Error when parsing praise message", error);
    return null;
  }
};

export default parsePraise;
