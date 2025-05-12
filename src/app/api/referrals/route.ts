import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  sub: string;
  partnerId: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { partnerId: string }
    const body = await req.json()

    const {
      referrerPhone,
      referrerName,
      referredPhone,
      referredName,
      procedure,
      planValue
    } = body

    const partnerId = decoded.partnerId

    const referrer = await getOrCreatePerson(referrerPhone, referrerName, partnerId)
    const referred = await getOrCreatePerson(referredPhone, referredName, partnerId)

    const commission = Number((planValue * 0.05).toFixed(2))

    await prisma.indication.create({
      data: {
        procedure,
        planValue,
        commissionValue: commission,
        indicatedById: referrer.id,
        indicatedId: referred.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao registrar indicação' }, { status: 500 })
  }

  async function getOrCreatePerson(phone: string, name: string, partnerId: string) {
		const existing = await prisma.person.findUnique({ where: { phone } })
		if (existing) return existing
		return await prisma.person.create({
			data: { name, phone, partnerId }
		})
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      let decoded: TokenPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      } catch {
        throw new Error('Invalid token');
      }

      const indications = await prisma.indication.findMany({
        where: {
          indicatedBy: {
            partnerId: decoded.partnerId,
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

      console.log('Indications GET:', indications);
      

    return NextResponse.json({ indications })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao registrar indicação' }, { status: 500 })
  }
}
