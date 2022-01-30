import { ethers } from "ethers";
import * as artifact from "../utils/ToucanPraiseToken.json";
import ifcWalletConnection from "./ifcWalletConnection";
require("dotenv").config();

/**
 * @param praiserWalletConnection will be used for the address of the praiser
 * @param praiseTargetWalletConnection will be used for the address of the praiseTarget
 * @returns the praiseTxn object (which should have a status === 1 if successful), or null if some error happened
 */
const callPraise = async (
  praiserWalletConnection: ifcWalletConnection,
  praiseTargetWalletConnection: ifcWalletConnection
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      // TODO change when deploy on another network
      process.env.INFURA_RINKEBY_URL,
      4
    );
    let wallet = new ethers.Wallet(
      // TODO change when deploy on another network
      process.env.RINKEBY_PRIVATE_KEY || "",
      provider
    );
    // TODO change when deploy on another network
    const signer = provider.getSigner(process.env.OWNER_ADDRESS_RINKEBY);
    wallet = wallet.connect(provider);

    const tptContract = new ethers.Contract(
      // TODO change when deploy on another network
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
    console.log(`Sending praise with transaction hash:`, praiseTxn.hash);
    return await praiseTxn.wait();
  } catch (error) {
    console.error(`Error interacting with the contract, callPraise():`, error);
    return null;
  }
};

export default callPraise;
