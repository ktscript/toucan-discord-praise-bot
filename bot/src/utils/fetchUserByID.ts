import { User } from "discord.js";
import { discord } from "./discordClient";

/**
 *
 * @param discordId the discord ID of the user
 * @returns a User object (from the discord client) representing the given ID
 */
const fetchUserById = async (discordId: string): Promise<User> =>
  await discord.users.fetch(discordId);

export default fetchUserById;
