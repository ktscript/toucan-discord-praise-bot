import ifcDiscordtoWalletConnection from "./ifcDiscordtoWalletConnection";
import { supabase } from "./supabaseClient";

const fetchWalletConnection = async (
  _discordId: string
): Promise<ifcDiscordtoWalletConnection | null> => {
  try {
    let { data, error } = await supabase
      .from<ifcDiscordtoWalletConnection>("discordToWalletConnections")
      .select("*")
      .eq("discord_id", _discordId);
    if (error) throw error;
    if (!data) throw new Error("No data matching the given Discord ID");
    return data;
    return data[0];
  } catch (error: any) {
    console.log(`Error when checking walletConnection:`, error);
    return null;
  }
};

export default fetchWalletConnection;
