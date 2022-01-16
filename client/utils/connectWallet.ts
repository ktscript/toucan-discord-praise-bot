import { ethers } from "ethers";
import router from "next/router";
import { toast } from "react-toastify";
import fetchProfile from "./fetchProfile";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import { supabase } from "./supabaseClient";
import toastOptions from "./toastOptions";

/**
 * @description Attempts to connect to the MetaMask wallet and insert the discordToWalletConnection in dB
 * @returns nothing, it notifiess us of the result with Toastify
 */
const connectWallet = async () => {
  console.log("attempting to connect to the MetaMask wallet");
  // TODO: I want to be able to use WalletConnect too
  try {
    // @ts-ignore
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("MetaMask not connected");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await provider.getNetwork();
    if (chainId != 4) {
      throw new Error("Make sure you are on Rinkeby Test Network.");
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const user = await fetchProfile();

    const { data, error } = await supabase
      .from<discordToWalletConnection>("discordToWalletConnections")
      .insert([
        {
          // @ts-ignore because if it's null it will simply return an error which is handled down below
          user_id: user.id,
          // @ts-ignore because if it's null it will simply return an error which is handled down below
          discord_id: user.user_metadata.provider_id,
          wallet_address: accounts[0],
        },
      ]);
    if (error) throw error;

    toast(`Connected your wallet`, toastOptions);
  } catch (error: any) {
    console.error("error when connecting wallet", error);
    toast.error(error.message, toastOptions);
  }
};

export default connectWallet;
