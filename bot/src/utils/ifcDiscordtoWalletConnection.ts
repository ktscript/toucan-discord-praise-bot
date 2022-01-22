/**
 * this interface represents the schema of the discordToWalletConnections table
 * @user_id is the Supabase ID of the user
 * @discord_id is the discord ID of the user
 * @wallet_address is the wallet address that the user has associated with his account
 */
export default interface discordToWalletConnection {
  user_id: string;
  discord_id: string;
  wallet_address: string;
}
