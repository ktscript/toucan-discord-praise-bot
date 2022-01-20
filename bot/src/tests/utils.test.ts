import { expect } from "chai";
import { parse, ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import callPraise from "../utils/callPraise";
import { discord } from "../utils/discordClient";
import fetchUserById from "../utils/fetchUserByID";
import fetchWalletConnection from "../utils/fetchWalletConnection";
import ifcPraise from "../utils/ifcPraise";
import parsePraise from "../utils/parsePraise";
require("dotenv").config();

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

describe("Testing utils functions", () => {
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

  describe("Testing the fetchUserByID() function", () => {
    it("Expecting a User object for the corresponding Discord ID", async () => {
      const discordToken: string = process.env.DISCORD_TOKEN || "";
      discord.login(discordToken);
      const user = await fetchUserById("369184527286927371"); // this would be me
      discord.destroy();

      expect(user.id).to.eql("369184527286927371");
    });
  });

  describe("Testing the fetchWalletConnection() function", () => {
    it("Expecting a discordToWalletConnection object for the corresponding Discord ID", async () => {
      const walletConnection = await fetchWalletConnection(
        "369184527286927371" // this would be me
      );

      expect(walletConnection).to.eql("369184527286927371");
    });
  });

  describe("Testing the callPraise() function", () => {
    it("Expecting a ...", async () => {
      const praiserWalletConnection = await fetchWalletConnection(
        "369184527286927371" // this would be me
      );
      const praiseTargetWalletConnection = await fetchWalletConnection(
        "927661675736350791" // this would be Toucan Praise Bot
      );
      expect(praiserWalletConnection).to.not.be.undefined;
      expect(praiserWalletConnection).to.not.be.null;
      expect(praiseTargetWalletConnection).to.not.be.undefined;
      expect(praiseTargetWalletConnection).to.not.be.null;
      if (!praiserWalletConnection || !praiseTargetWalletConnection) {
        return;
      }
      const target = await fetchUserById("targetId");
      const res = await callPraise(
        exampleMessage,
        target,
        praiserWalletConnection,
        praiseTargetWalletConnection
      );

      console.log(res);
      // I'm not really sure what it should return lol
      expect(res).to.eql("369184527286927371");
    });
  });
});
