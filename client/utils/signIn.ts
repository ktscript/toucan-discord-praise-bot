import { toast } from "react-toastify";
import { supabase } from "./supabaseClient";
import toastOptions from "./toastOptions";

/**
 * @description Attempts to connect to sign the user in with discord
 * @returns nothing, it notifys us with Toastify if there was an error
 */
const signIn = async () => {
  console.log("attempting to sign in");
  try {
    const { user, session, error } = await supabase.auth.signIn({
      provider: "discord",
    });
    if (error) throw error;
  } catch (error: any) {
    console.error("error when signing in", error);
    toast.error(error.error_description || error.message, toastOptions);
  }
};

export default signIn;
