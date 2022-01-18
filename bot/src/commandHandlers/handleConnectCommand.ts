import { Message } from "discord.js";
import fetchWalletConnection from "../utils/fetchWalletConnection";

const handleConnectCommand = (msg: Message, clientUrl: string) => {
  console.log(
    `${msg.author.username} (ID: ${msg.author.id}) requested to connect!`
  );
  msg.react("🌳");

  if (async () => await fetchWalletConnection(msg.author.id)) {
    msg.reply(
      `You have connected before. You can manage your profile here ${clientUrl}`
    );
    return;
  }

  msg.reply(`To connect your wallet, go to ${clientUrl}`);
  return;
};

export default handleConnectCommand;
