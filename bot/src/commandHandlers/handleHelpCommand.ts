import { Message } from "discord.js";

const handleHelpCommand = (msg: Message) => {
  console.log(`${msg.author} needs help!`);
  msg.react("🌳");
  msg.reply(
    `Hey there, I'm the Praise Bot. Here's a list of the commands that you can use: ` +
      `\n\n- "!connect" to connect your discord & wallet to this bot so you can praise & be praised` +
      `\n\n- "!profile" will let you know if your discord or wallet are connected to the bot` +
      `\n\n- "!praise @john.appleseed for [insert reason]" to praise someone with the reason for the praise. ` +
      `It's very important to tag them before stating the reason. Stating a reason is optional, ` +
      `but if you do, you have to mark it by using the "for" keyword before stating the reason.` +
      `\n\n Those are all the commands. It's important to note that the amount of TPT the person you praise ` +
      `receives is calculated based on how much TPT you have yourself. In this way, TPT acts like reputation.`
  );
};

export default handleHelpCommand;
