import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = removeAllThatNotNumbers(searchParams)
  if (!phone) {
    return NextResponse.json({ error: 'Telefone não informado' }, { status: 400 })
  }

  const person = await prisma.person.findFirst({ where: { phone } })
  if (!person) {
    return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ id: person.id, name: person.name })
}
function removeAllThatNotNumbers(searchParams: URLSearchParams) {
  return searchParams.get('phone')?.replaceAll(/\D/g, '')
}

