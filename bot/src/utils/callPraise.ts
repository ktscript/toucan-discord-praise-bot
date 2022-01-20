import { Message, User } from "discord.js";
import { ethers } from "ethers";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import * as artifact from "../utils/ToucanPraiseToken.json";

const callPraise = async (
  msg: Message,
  target: User,
  praiserWalletConnection: discordToWalletConnection,
  praiseTargetWalletConnection: discordToWalletConnection
) => {
  // get provider for Rinkeby (4 == Rinkeby)
  const provider = ethers.getDefaultProvider(4, {
    alchemy: process.env.RINKEBY_PRIVATE_KEY || null,
    etherscan: process.env.ETHERSCAN_API_KEY || null,
  });
  const tptContract = new ethers.Contract(
    process.env.RINKEBY_CONTRACT_ADDRESS || "",
    artifact.abi,
    provider
  );
  const praiserAddress = praiserWalletConnection.wallet_address;
  const praiseTargetAddress = praiseTargetWalletConnection.wallet_address;
  const praiseTxn = await tptContract.praise(
    praiserAddress,
    praiseTargetAddress,
    {
      gasLimit: 300000,
    }
  );
  console.log(
    `Sending praise (${msg.author} to ${target}) with transaction hash:`,
    praiseTxn.hash
  );
  return await praiseTxn.wait();
};

export default callPraise;
