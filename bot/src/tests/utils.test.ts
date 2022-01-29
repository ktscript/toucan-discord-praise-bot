import { expect } from "chai";
import { parse, ParsedMessage } from "discord-command-parser";
import { Message } from "discord.js";
import { BigNumber, utils } from "ethers";
import callPraise from "../utils/callPraise";
import { discord } from "../utils/discord/discordClient";
import fetchTptBalance from "../utils/fetchTptBalance";
import fetchUserById from "../utils/discord/fetchUserByID";
import fetchWalletConnection from "../utils/fetchWalletConnection";
import ifcPraise from "../utils/discord/ifcPraise";
import parsePraise from "../utils/discord/parsePraise";
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

  describe("Testing the fetchTptBalance() function", () => {
    it("Expecting a my tpt balance to be 30", async () => {
      const myBalance = await fetchTptBalance(
        "0x721F6f7A29b99CbdE1F18C4AA7D7AEb31eb2923B"
      );

      /**
       * this can change depending on how many TPT the owner contract has so do take that into account if it fails
       */
      expect(myBalance).to.eql(utils.parseEther("30"));
    });
  });

  describe("Testing the fetchWalletConnection() function", () => {
    it("Expecting a discordToWalletConnection object for the corresponding Discord ID", async () => {
      const walletConnection = await fetchWalletConnection(
        "369184527286927371" // this would be me
      );

      expect(walletConnection?.discord_id).to.eql("369184527286927371");
    });
  });
});
