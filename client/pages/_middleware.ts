import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import getUserByCookie from "../utils/getUserByCookie";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  let authResult = await getUserByCookie(req);
  if (authResult.error) {
    console.log(
      "Authorization error, redirecting to login page",
      authResult.error
    );
    return NextResponse.redirect(
      `/?ret=${encodeURIComponent(req.nextUrl.pathname)}`
    );
  } else if (!authResult.user) {
    console.log("No auth user, redirecting");
    return NextResponse.redirect(
      `/?ret=${encodeURIComponent(req.nextUrl.pathname)}`
    );
  } else {
    console.log("User is found", authResult.user);
    return NextResponse.next();
  }
}
