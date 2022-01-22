import { Message, User } from "discord.js";
import { ethers } from "ethers";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import * as artifact from "../utils/ToucanPraiseToken.json";
require("dotenv").config();

/**
 * @param msg will be used for the success console.log
 * @param target will be used for the success console.log
 * @param praiserWalletConnection will be used for the address of the praiser
 * @param praiseTargetWalletConnection will be used for the address of the praiseTarget
 * @returns the praiseTxn object (which should have a status === 1 if successful), or null if some error happened
 */
const callPraise = async (
  msg: Message,
  target: User,
  praiserWalletConnection: discordToWalletConnection,
  praiseTargetWalletConnection: discordToWalletConnection
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.INFURA_RINKEBY_URL,
      4
    );
    let wallet = new ethers.Wallet(
      process.env.RINKEBY_PRIVATE_KEY || "",
      provider
    );
    const signer = provider.getSigner(process.env.OWNER_ADDRESS_RINKEBY);
    wallet = wallet.connect(provider);

    const tptContract = new ethers.Contract(
      process.env.RINKEBY_CONTRACT_ADDRESS || "",
      artifact.abi,
      wallet
    );

    const praiserAddress = praiserWalletConnection.wallet_address;
    const praiseTargetAddress = praiseTargetWalletConnection.wallet_address;
    const praiseTxn = await tptContract.praise(
      praiserAddress,
      praiseTargetAddress,
      {
        value: ethers.utils.parseEther("0"),
        gasLimit: 300000,
      }
    );
    console.log(
      `Sending praise (${msg.author.id} to ${target.id})(these are discord IDs) with transaction hash:`,
      praiseTxn.hash
    );
    return await praiseTxn.wait();
  } catch (error) {
    console.error(`Error interacting with the contract, callPraise():`, error);
    return null;
  }
};

export default callPraise;
