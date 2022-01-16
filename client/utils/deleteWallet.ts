import { toast } from "react-toastify";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import { supabase } from "./supabaseClient";
import toastOptions from "./toastOptions";

/**
 * @description Attempts to delete user's wallet from Supabase dB
 * @returns the walletToDiscordConnection object or null; also notifys us of the result with Toastify
 */
const deleteWallet = async (): Promise<discordToWalletConnection | null> => {
  console.log("attempting to delete wallet");
  try {
    const { data, error } = await supabase
      .from<discordToWalletConnection>("discordToWalletConnections")
      .delete();
    if (error) throw error;
    if (data) return data[0];
    return null;
  } catch (error: any) {
    console.error("error deleting wallet", error);
    toast.error(error.message, toastOptions);
    return null;
  }
};

export default deleteWallet;
