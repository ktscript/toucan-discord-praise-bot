import { Message } from "discord.js";

/**
 *
 * @param msg the non-parsed message object, can be used to reply to the message
 */
const handleHelpCommand = (msg: Message) => {
  `${msg.author.username} (ID: ${msg.author.id}) needs help!`;
  msg.react("🌳");
  msg.reply(
    `Hey there, I'm the Praise Bot. Here's a list of the commands that you can use: ` +
      `\n\n- "!connect" to connect your discord & wallet to this bot so you can praise & be praised` +
      `\n\n- "!praise @john.appleseed for [insert reason]" to praise someone with the reason for the praise. ` +
      `It's very important to tag them before stating the reason. Stating a reason is optional, ` +
      `but if you do, you have to mark it by using the "for" keyword before stating the reason.` +
      `\n\n Those are all the commands. It's important to note that the amount of TPT the person you praise ` +
      `receives is calculated based on how much TPT you have yourself. In this way, TPT acts like reputation.` +
      `\n\n One more important thing, this is the token's address: 0x5C3D88A68d3AD54CfEB87d56Cc64421E3EEEC347.` +
      `\n\n You will use this address to import the token into your wallet.`
  );
};

export default handleHelpCommand;
