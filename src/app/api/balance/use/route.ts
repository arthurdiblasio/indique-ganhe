import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
import { StatementType } from "@prisma/client";
import { formatMoney } from "@/utils/formatters";

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

    const { phone, value } = body;

    // const partnerId = decoded.partnerId;

    const partner = await getPartner();

    const customer = await getCustomer(
      setOnlyNumbers(phone.toString()),
      partner.id
    );

    await prisma.$transaction([
      prisma.statement.create({
        data: {
          personId: customer.id,
          amount: Number(value),
          type: StatementType.DEBIT,
          reason: `Uso de saldo de ${formatMoney(
            value.toString()
          )} para uso em ${partner.name}`,
        },
      }),
      prisma.person.update({
        where: { id: customer.id },
        data: { balance: { decrement: Number(value) } },
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

  async function getCustomer(phone: string, partnerId: string) {
    const customer = await prisma.person.findUnique({
      where: { phone, partnerId },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}

async function getPartner() {
  const partner = await prisma.partner.findMany();

  return partner[0];
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

    const partner = await getPartner();

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
