import { ethers } from "ethers";

const getMetaMaskAccount = async (): Promise<any> => {
  // @ts-ignore
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("MetaMask not connected");
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const { chainId } = await provider.getNetwork();
  // TODO add more networks
  if (chainId != 4) {
    throw new Error("Make sure you are on Rinkeby Test Network.");
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts;
};

export default getMetaMaskAccount;
