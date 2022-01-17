import { ApiError, User } from "@supabase/supabase-js";

interface ifcUserByCookie {
  user: User | null;
  error: string | null;
}

// I made this function in an attempt to replace the broken supabase.auth.api.getUserByCookie()
// mine doesn't work either
const getUserByCookie = async (req: any): Promise<ifcUserByCookie> => {
  let token = req.cookies["sb:token"];
  console.log("req.cookies", req.cookies);
  if (!token) {
    return {
      user: null,
      error: "There is no supabase token in request cookies",
    };
  }
  let authRequestResult = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        APIKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    }
  );

  let result = await authRequestResult.json();
  console.log("Supabase auth result", result);
  if (authRequestResult.status != 200) {
    return {
      user: null,
      error: `Supabase auth returned ${authRequestResult.status}. See logs for details`,
    };
  } else if (result.aud === "authenticated") {
    return {
      user: result,
      error: null,
    };
  }
  return { user: null, error: "Unexpected error" };
};

export default getUserByCookie;
