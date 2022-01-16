import { supabase } from "../../utils/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("api is being used");
  supabase.auth.api.setAuthCookie(req, res);
}
