import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

/**
 *
 * @returns either the User object with all the authenticated user's data or null
 */
const fetchProfile = async (): Promise<User | null> => {
  try {
    const profileData = await supabase.auth.user();
    if (!profileData) throw new Error("User not authenticated");
    return profileData;
  } catch (error: any) {
    return null;
  }
};

export default fetchProfile;
