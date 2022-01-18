import ifcPraise from "./ifcPraise";

const parsePraise = (parsed: any): ifcPraise | null => {
  try {
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

    return praise;
  } catch (error) {
    console.log("Error when parsing praise message", error);
    return null;
  }
};

export default parsePraise;
