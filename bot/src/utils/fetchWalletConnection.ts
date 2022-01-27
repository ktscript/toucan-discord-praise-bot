import { PostgrestResponse } from "@supabase/supabase-js";
import ifcWalletConnection from "./ifcWalletConnection";
import { supabase } from "./supabaseClient";

/**
 *
 * @param discordId the discord ID of the user
 * @returns the discordToWalletConnection of the user (as stored in Supabase), or null if unsuccessful
 */
const fetchWalletConnection = async (
  discordId: string
): Promise<ifcWalletConnection | null> => {
  try {
    const { data, error }: PostgrestResponse<ifcWalletConnection> =
      await supabase
        .from<ifcWalletConnection>("wallet_connections")
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
