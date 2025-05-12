import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

interface TokenPayload {
  sub: string
  partnerId: string
  email: string
}

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value
    console.log('token', token);
  if (!token) {
    redirect('/login')

    return <p className="text-center mt-10 text-red-600">Token não encontrado</p>
  }

  let decoded: TokenPayload
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
  } catch {
    return <p className="text-center mt-10 text-red-600">Token inválido</p>
  }

  const partner = await prisma.partner.findUnique({
    where: { id: decoded.partnerId }
  })

  const indications = await prisma.indication.findMany({
    where: {
      indicatedBy: {
        partnerId: decoded.partnerId
      }
    },
    include: {
      indicated: true,
      indicatedBy: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Olá, {partner?.name}
      </h1>

      <h2 className="text-lg text-gray-700 font-semibold mb-2">Últimas indicações</h2>

      {indications.length === 0 ? (
        <p className="text-gray-500">Nenhuma indicação registrada.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Indicado</th>
                <th className="px-4 py-2">Indicado por</th>
                <th className="px-4 py-2">Procedimento</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {indications.map((ind) => (
                <tr key={ind.id} className="border-t">
                  <td className="px-4 py-2">{ind.indicated.name}</td>
                  <td className="px-4 py-2">{ind.indicatedBy.name}</td>
                  <td className="px-4 py-2">{ind.procedure}</td>
                  <td className="px-4 py-2">R$ {Number(ind.planValue).toFixed(2)}</td>
                  <td className="px-4 py-2">R$ {Number(ind.commissionValue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
