import { supabase } from "./supabaseClient";

const fetchWalletConnection = async (_discordId: string) => {
  try {
    let { data, error } = await supabase
      .from("discordToWalletConnections")
      .select()
      .eq("discord_id", _discordId);
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.log(`Error when checking walletConnection:`, error);
    return null;
  }
};

export default fetchWalletConnection;
