import { Message } from "discord.js";
import fetchWalletConnection from "../utils/fetchWalletConnection";

/**
 *
 * @param msg the non-parsed message object, can be used to reply to the message
 * @param clientUrl the url of our website where ppl can manage their profile
 * @returns nothing, the return is used to stop the rest of the function from being executed
 */
const handleConnectCommand = (msg: Message, clientUrl: string) => {
  console.log(
    `${msg.author.username} (ID: ${msg.author.id}) requested to connect!`
  );
  /**
   * the tree reaction show the user that the bot is processing his command
   */
  msg.react("🌳");

  /**
   * if the user has a wallet connection, you give him a certain message
   */
  if (async () => await fetchWalletConnection(msg.author.id)) {
    msg.reply(
      `You have connected before your discord already. You can manage your profile and connect your wallet here ${clientUrl}`
    );
    return;
  }

  /**
   * if the user doesn't have a wallet connection, you give him this other message
   */
  msg.reply(`To connect your wallet, go to ${clientUrl}`);
  return;
};

export default handleConnectCommand;
