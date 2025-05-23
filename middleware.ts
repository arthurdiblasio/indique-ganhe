import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  // const token = req.cookies.get("token")?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // try {
  //   jwt.verify(token, process.env.JWT_SECRET!);
  // return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
  // } catch (err) {
  //   console.error("Token inválido ou expirado", err);
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
