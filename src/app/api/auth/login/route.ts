import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password, remember } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { partner: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      partnerId: user.partnerId,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: remember ? "30d" : "1d",
    }
  );

  const response = NextResponse.json({ message: "Login efetuado" });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 dias ou 1 dia
    path: "/",
  });

  console.log("Usuário autenticado, redirecionando para dashboard");

  return response;
}
