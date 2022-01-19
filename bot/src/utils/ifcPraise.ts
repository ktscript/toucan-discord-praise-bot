import { ClientUser, User } from "discord.js";

export default interface ifcPraise {
  praiseTargets: User[];
  reason?: string;
}
