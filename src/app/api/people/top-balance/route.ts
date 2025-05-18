import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit')) || 10

  const people = await prisma.person.findMany({
    orderBy: { balance: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      phone: true,
      balance: true,
    },
  })

  return NextResponse.json(people)
}
