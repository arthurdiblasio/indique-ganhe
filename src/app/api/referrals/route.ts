import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
import { StatementType } from "@prisma/client";

// interface TokenPayload {
//   sub: string;
//   partnerId: string;
//   email: string;
// }

export async function POST(req: NextRequest) {
  try {
    // const token = req.cookies.get("token")?.value;
    // if (!token)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    //   partnerId: string;
    // };
    const body = await req.json();

    const {
      referrerPhone,
      referrerName,
      referredPhone,
      referredName,
      procedure,
      planValue,
    } = body;

    const planValueInCents = planValue / 100;

    const [partner] = await prisma.partner.findMany();

    const referrer = await getOrCreatePerson(
      setOnlyNumbers(referrerPhone.toString()),
      referrerName,
      partner.id
    );
    const referred = await getOrCreatePerson(
      setOnlyNumbers(referredPhone.toString()),
      referredName,
      partner.id
    );

    const commission = Number(
      (Number(setOnlyNumbers(planValueInCents.toString())) * 0.05).toFixed(2)
    );

    await prisma.$transaction([
      prisma.indication.create({
        data: {
          procedure,
          planValue: planValueInCents,
          commissionValue: commission,
          indicatedById: referrer.id,
          indicatedId: referred.id,
        },
      }),
      prisma.statement.create({
        data: {
          personId: referrer.id,
          amount: Number(commission),
          type: StatementType.CREDIT,
          reason: `Indicação de ${referredName} para o procedimento ${procedure}`,
        },
      }),
      prisma.person.update({
        where: { id: referrer.id },
        data: { balance: { increment: Number(commission) } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao registrar indicação" },
      { status: 500 }
    );
  }

  function setOnlyNumbers(str: string) {
    return str.replace(/\D/g, "");
  }

  async function getOrCreatePerson(
    phone: string,
    name: string,
    partnerId: string
  ) {
    const existing = await prisma.person.findUnique({ where: { phone } });
    if (existing) return existing;
    return await prisma.person.create({
      data: { name, phone, partnerId },
    });
  }
}

export async function GET() {
  try {
    // const token = req.cookies.get("token")?.value;
    // if (!token)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // let decoded: TokenPayload;
    // try {
    //   decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    // } catch {
    //   throw new Error("Invalid token");
    // }

    const [partner] = await prisma.partner.findMany();

    const indications = await prisma.indication.findMany({
      where: {
        indicatedBy: {
          partnerId: partner.id,
        },
      },
      include: {
        indicated: true,
        indicatedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json(indications);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao registrar indicação" },
      { status: 500 }
    );
  }
}
