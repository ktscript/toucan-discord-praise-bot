import { toast } from "react-toastify";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import { supabase } from "./supabaseClient";
import toastOptions from "./toastOptions";

/**
 * @description Attempts to fetch user's wallet from Supabase dB
 * @returns the walletToDiscordConnection object or null; also notifys us of the result with Toastify
 */
const fetchWallet = async (): Promise<discordToWalletConnection | null> => {
  // TODO this function works on the client but not on the server, no idea why
  try {
    const { data, error } = await supabase
      .from<discordToWalletConnection>("discordToWalletConnections")
      .select();
    if (error) throw error;
    if (data && data.length > 0) return data[0];
    return null;
  } catch (error: any) {
    toast.error(error.message, toastOptions);
    return null;
  }
};

export default fetchWallet;
