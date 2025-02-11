// import { auth } from "@/helper/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log("Middleware Path:", pathname);
  console.log("Session Data:", token);
  if (
    (pathname.startsWith("/loginPage") ||
      pathname.startsWith("/registerPage")) &&
    token
  ) {
    console.log("Redirecting to home...");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/loginPage", "/registerPage"],
};
