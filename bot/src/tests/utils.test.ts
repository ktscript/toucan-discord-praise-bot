import { expect } from "chai";
import { parse, ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import { discord } from "../utils/discordClient";
import ifcPraise from "../utils/ifcPraise";
import parsePraise from "../utils/parsePraise";

const PREFIX = "!";
// this is the best example of a message I could reproduce so that I can actually implement some testing
const exampleMessage: Message = {
  channelId: "927691376638955533",
  guildId: "927691376638955530",
  id: "933365660107558933",
  createdTimestamp: 1642602114465,
  type: "DEFAULT",
  system: false,
  content: "!praise <@!927661675736350791> for ABC",
  // @ts-ignore
  author: {
    id: "369184527286927371",
    bot: false,
    system: false,
    username: "Alex Lazar",
    discriminator: "5943",
    avatar: "619399b21d18e86dc5470403e518a915",
    banner: undefined,
    accentColor: undefined,
  },
  pinned: false,
  tts: false,
  nonce: "933365659264352256",
  embeds: [],
  components: [],
  editedTimestamp: null,
  webhookId: null,
  groupActivityApplication: null,
  applicationId: null,
  activity: null,
  reference: null,
  interaction: null,
};

describe("Testing the parsePraise() function", () => {
  it("Expecting a praise object with the correct praiseTarget and reason", () => {
    const parsed: ParsedMessage<Message<boolean>> = parse(
      exampleMessage,
      PREFIX
    );
    const praise: ifcPraise | null = parsePraise(parsed);

    expect(praise).to.eql({
      praiseTargets: ["927661675736350791"],
      reason: "for ABC",
    });
  });
});
