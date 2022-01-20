import { PostgrestResponse } from "@supabase/supabase-js";
import discordToWalletConnection from "./ifcDiscordtoWalletConnection";
import ifcDiscordtoWalletConnection from "./ifcDiscordtoWalletConnection";
import { supabase } from "./supabaseClient";

const fetchWalletConnection = async (
  discordId: string
): Promise<ifcDiscordtoWalletConnection | null> => {
  try {
    const { data, error }: PostgrestResponse<discordToWalletConnection> =
      await supabase
        .from<ifcDiscordtoWalletConnection>("discordToWalletConnections")
        .select()
        .eq("discord_id", discordId);
    if (error) throw error;
    if (!data || !data[0])
      throw new Error("No data matching the given Discord ID");
    return data[0];
  } catch (error: any) {
    console.error(`Error when checking walletConnection:`, error);
    return null;
  }
};

export default fetchWalletConnection;
