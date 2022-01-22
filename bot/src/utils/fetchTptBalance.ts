import { ethers } from "ethers";
import * as artifact from "../utils/ToucanPraiseToken.json";

/**
 * TODO: a function that fetches someone TPT balance
 * @param wallet_address the address that we want to check the TPT balance for
 */
const fetchTptBalance = async (
  walletAddress: string
): Promise<number | null> => {
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

    return await tptContract.balanceOf(walletAddress).call();
  } catch (error) {
    console.error(
      `Error interacting with the contract, fetchTptBalance():`,
      error
    );
    return null;
  }
};

export default fetchTptBalance;
