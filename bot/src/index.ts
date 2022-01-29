import { Message, User } from "discord.js";
import { parse, ParsedMessage } from "discord-command-parser";
import { discord } from "./utils/discord/discordClient";
import { handlePraiseCommand } from "./commandHandlers/handlePraiseCommand";
import handleConnectCommand from "./commandHandlers/handleConnectCommand";
import handleHelpCommand from "./commandHandlers/handleHelpCommand";
import fetchWalletConnection from "./utils/fetchWalletConnection";
import fetchTptBalance from "./utils/fetchTptBalance";
import { utils } from "ethers";
import { App as Slack } from "@slack/bolt";
import { SayFn, SlackCommandMiddlewareArgs } from "@slack/bolt";
require("dotenv").config();

// TODO we are not actually storing or doing anything with the praise reasons aside from parsing them

// <discord bot>
const PREFIX = "!";
const clientUrl: string = process.env.CLIENT_URL || "";

discord.on("ready", () => {
  console.log("Discord Bot Online! Woohooo!");
});

// TODO it'd be nice if all msg.reply would be private

/**
 * I had a slight fear with this interval process, that it may be too resource-intensive
 * since it will run a Supabase query and potentially a read-only smart contract method for all server users.
 * But, at the current size of the server (400 something ppl) and assuming not all ppl will actually use TPT,
 * I think we'll be fine.
 */
setInterval(async () => {
  /**
   * TODO calling this so the interval doesn't actually do anything for now (until I test everything in here)
   */
  return;
  /**
   * this runs through every user that we have connected to our server
   */
  discord.users.forEach(async (user: User) => {
    /**
     * it checks if user has connected their wallet yet and skips him if not
     */
    const walletConnection = await fetchWalletConnection("discord", user.id);
    if (!walletConnection) return;

    /**
     * if the user has a wallet connected, we need to check his TPT balance
     */
    const balance = await fetchTptBalance(walletConnection.wallet_address);

    /**
     * and this is the point where we can give him roles, nicknames and other rewards for having a certain TPT balance
     */
    if (balance > utils.parseEther("100")) {
      console.log(`${user} has a good reputation`);
    }
  });
}, 1000 * 60 * 60 * 24); // the interval runs once a day, I don't think we need to check ppl's balances much more often than this

discord.on("messageCreate", (msg: Message) => {
  /**
   * every time a message is created we will use the discord-command-parser library to help parsing the message
   */
  const parsed: ParsedMessage<Message<boolean>> = parse(msg, PREFIX);
  if (!parsed.success) return;

  if (parsed.command === "help") {
    handleHelpCommand(msg);
  }

  if (parsed.command === "connect") {
    handleConnectCommand(msg, clientUrl);
  }

  if (parsed.command === "praise") {
    handlePraiseCommand(parsed, msg, clientUrl);
  }
});

const discordToken: string = process.env.DISCORD_TOKEN || "";
discord.login(discordToken);
// </discord bot>

// <slack_bot>
/**
 * TODO while the discord bot can parse messages to praise multiple people, the Slack one can't yet do that.
 * On Slack you can only praise one person at a time.
 */

// TODO the slack part is kinda messy, need to clean it up
const slack: Slack = new Slack({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

interface ifcCallbackFnParams {
  message: any;
  say: SayFn;
}

slack.message("hello", async ({ message, say }: ifcCallbackFnParams) => {
  console.log(`O zis hello unu ${message.user} !`);
  await say(`Salut bai baiatule <@${message.user}>!`);
});

slack.command(
  "/echo",
  async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    await ack();
    await respond(
      `${
        command.text || "Wow, be careful. You should give me something to echo."
      }`
    );
  }
);

slack.command(
  "/help",
  async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    await ack();
    await respond(
      `Hey there, I'm the Praise Bot. Here's a list of the commands that you can use: ` +
        `\n\n- "/connect" to connect your slack & wallet to this bot so you can praise & be praised` +
        `\n\n- "/praise @john.appleseed for [insert reason]" to praise someone with the reason for the praise. ` +
        `It's very important to tag them before stating the reason. Stating a reason is optional, ` +
        `but if you do, you have to mark it by using the "for" keyword before stating the reason.` +
        `\n\n Those are all the commands. It's important to note that the amount of TPT the person you praise ` +
        `receives is calculated based on how much TPT you have yourself. In this way, TPT acts like reputation.` +
        `\n\n One more important thing, we are using Rinkeby (for now) &` +
        // TODO this address needs to be modified if you redeploy
        ` this is the token's address: 0x5C3D88A68d3AD54CfEB87d56Cc64421E3EEEC347.` +
        `\n\n You will use this address to import the token into your wallet.`
    );
  }
);

slack.command(
  "/connect",
  async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
    await ack();
    await respond(
      `Connect your wallet (or manage your profile) at ${clientUrl}`
    );
  }
);

slack.command(
  "/praise",
  async ({
    command,
    ack,
    respond,
    body,
    payload,
  }: SlackCommandMiddlewareArgs) => {
    try {
      await ack();

      /**
       * First we parse the praise
       */
      const expressions = {
        praiseTargetSlackId: /^<@[a-zA-Z0-9]*/gm,
        praiseReason: /for [ch:(\S+\s)]*/,
      };

      let tempPraiseTarget = body.text.match(expressions.praiseTargetSlackId);
      const praiseTarget = tempPraiseTarget
        ? tempPraiseTarget[0].replace("<@", "")
        : "";

      let tempPraiseReason = body.text.match(expressions.praiseReason);
      const praiseReason = tempPraiseReason ? tempPraiseReason[0] : null;
      /**
       * We handle any errors
       */
      if (!praiseTarget)
        throw new Error(
          `You need to specify a praise target <@${body.user_id}>.`
        );

      if (praiseTarget == body.user_id)
        throw new Error(`You can't praise yourself <@${body.user_id}>.`);

      // TODO check if both praiser and praise target have wallets connected

      // TODO interact with contract to praise

      /**
       * We let the user know the praise was successful
       */
      await respond(`We praised your target, <@${praiseTarget}>!`);
    } catch (error: any) {
      console.log("ERROR:", error.message);
      await respond(error.message);
    }
  }
);

(async () => {
  await slack.start();
  console.log("⚡️ Bolt app is running!");
})();
// </slack_bot>
