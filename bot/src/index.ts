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
import ifcWalletConnection from "./utils/ifcWalletConnection";
import callPraise from "./utils/callPraise";
import { supabase } from "./utils/supabaseClient";
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

interface ifcSlackInstallation {
  enterpriseId?: string;
  teamId: string;
  botToken: string; // starting with xoxb
  botId: string;
  botUserId: string;
}

const authorizeFn = async ({
  teamId,
  enterpriseId,
}: {
  teamId: string;
  enterpriseId?: string;
}) => {
  try {
    let { data: slack_installations, error } = await supabase
      .from("slack_installations")
      .select("*");

    if (slack_installations == null || error) {
      throw new Error("Could not find any slack installations");
    }

    if (!teamId && !enterpriseId) {
      throw new Error("Team ID and enterprise ID haven't been provided");
    }

    // Fetch team info from database
    for (const team of slack_installations) {
      // Check for matching teamId and enterpriseId in the installations array
      if (team.team_id == teamId && team.enterprise_id == enterpriseId) {
        // This is a match. Use these installation credentials.
        console.log(
          `A succesfull request was made by team ${team.team_id} or enterprise ${team.enterprise_id}`
        );
        return {
          // You could also set userToken insteadd
          botToken: team.botToken,
          botId: team.botId,
          botUserId: team.botUserId,
        };
      }
    }
    throw new Error("Could not find any MATCHING slack installations");
  } catch (error: any) {
    console.error(`Error when authorizeFn`, error.message);
  }
};

const slack: Slack = new Slack({
  // @ts-ignore
  authorize: authorizeFn,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
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
        // potential TODO this address needs to be modified if you redeploy
        ` this is the token's address: 0x5C3D88A68d3AD54CfEB87d56Cc64421E3EEEC347.` +
        `\n\n You will use this address to import the token into your wallet.`
    );
  }
);

slack.command(
  "/connect",
  async ({ command, ack, respond, body }: SlackCommandMiddlewareArgs) => {
    await ack();
    const walletConnection = await fetchWalletConnection("slack", body.user_id);
    if (walletConnection) {
      await respond(
        `Your wallet seems to be connected <@${body.user_id}>. Go to ${clientUrl} if you want to manage your profile.`
      );
    } else {
      await respond(
        `Connect your wallet (or manage your profile) at ${clientUrl}`
      );
    }
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
       * We handle any errors with the parsed praised
       */
      if (!praiseTarget)
        throw new Error(
          `You need to specify a praise target <@${body.user_id}>.`
        );

      if (praiseTarget == body.user_id)
        throw new Error(`You can't praise yourself <@${body.user_id}>.`);

      /**
       * We fetch the wallets and handle any errors
       */
      const praiserWalletConnection = await fetchWalletConnection(
        "slack",
        body.user_id
      );
      if (!praiserWalletConnection)
        throw new Error(
          `Your wallet is not connected <@${body.user_id}>. Go to ${clientUrl}`
        );

      const praiseTargetWalletConnection = await fetchWalletConnection(
        "slack",
        praiseTarget
      );
      if (!praiseTargetWalletConnection)
        throw new Error(
          `<@${praiseTarget}>'s wallet is not connected, so you can't praise them <@${body.user_id}>. ` +
            `They should go to ${clientUrl} to connect`
        );

      /**
       * Lastly, we call the praise method from the contract
       */
      const res = await callPraise(
        praiserWalletConnection,
        praiseTargetWalletConnection
      );

      // if the praise method was not successful, we handle that
      if (res.status !== 1) {
        throw new Error(
          "Something bad might have happened when calling the praise contract method."
        );
      }

      /**
       * If the code got here, we let the user know the praise was successful
       */
      await respond(
        `We successfully praised your <@${praiseTarget}>, <@${praiseTarget}>!`
      );
    } catch (error: any) {
      console.log("ERROR:", error.message);
      await respond(error.message);
    }
  }
);

(async () => {
  await slack.start();
  console.log("⚡️ Bolt/Slack app is running!");
})();
// </slack_bot>
