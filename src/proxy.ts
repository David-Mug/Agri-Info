import { auth } from "@/auth";
import { NextResponse } from "next/server";

const roleHome: Record<string, string> = {
  FARMER: "/farmer",
  BUYER: "/buyer",
  ADMIN: "/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const protectedPrefixes = ["/farmer", "/buyer", "/admin"];
  const matchedPrefix = protectedPrefixes.find((p) => pathname.startsWith(p));

  if (matchedPrefix) {
    if (!user) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const expectedPrefix = roleHome[user.role];
    if (expectedPrefix && !pathname.startsWith(expectedPrefix)) {
      return NextResponse.redirect(new URL(expectedPrefix, req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/farmer/:path*", "/buyer/:path*", "/admin/:path*"],
};
