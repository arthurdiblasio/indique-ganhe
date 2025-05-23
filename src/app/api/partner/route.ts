import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// interface TokenPayload {
//   sub: string;
//   partnerId: string;
//   email: string;
// }

export async function GET() {
  // const token = (await cookies()).get("token")?.value;
  // if (!token) {
  //   return;
  // }

  // let decoded: TokenPayload;
  // try {
  //   decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  // } catch {
  //   return;
  // }

  const partner = await prisma.partner.findMany();

  return NextResponse.json(partner[0]);
}
