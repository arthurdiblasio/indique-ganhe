import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const name = searchParams.get("name");
  const limitParam = searchParams.get("limit");
  const pageParam = searchParams.get("page");

  const limit = limitParam ? parseInt(limitParam) : 100;
  const page = pageParam ? parseInt(pageParam) : 1;
  const skip = (page - 1) * limit;

  const personFilter: {
    phone: {
      contains: string;
      mode: "insensitive";
    };
    name: {
      contains: string;
      mode: "insensitive";
    };
  } = {
    phone: {
      contains: "",
      mode: "insensitive",
    },
    name: {
      contains: "",
      mode: "insensitive",
    },
  };

  if (phone) {
    personFilter.phone = {
      contains: phone,
      mode: "insensitive",
    };
  }

  if (name) {
    personFilter.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  const people = await prisma.person.findMany({
    where: Object.keys(personFilter).length > 0 ? personFilter : undefined,
    select: { id: true },
  });

  const personIds = people.map((p) => p.id);

  const [statements, totalCount] = await Promise.all([
    prisma.statement.findMany({
      where: personIds.length ? { personId: { in: personIds } } : undefined,
      include: {
        person: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.statement.count({
      where: personIds.length ? { personId: { in: personIds } } : undefined,
    }),
  ]);

  return NextResponse.json({
    data: statements,
    totalCount,
    page,
    limit,
  });
}
