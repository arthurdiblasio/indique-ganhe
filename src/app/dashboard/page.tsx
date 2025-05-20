// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import { ProtectedLayout } from "../components/ProtectedLayout";
// import Link from "next/link";

// interface TokenPayload {
//   sub: string;
//   partnerId: string;
//   email: string;
// }

// export default async function DashboardPage() {
//   const token = (await cookies()).get("token")?.value;
//   if (!token) {
//     redirect("/login");

//     return (
//       <p className="text-center mt-10 text-red-600">Token não encontrado</p>
//     );
//   }

//   let decoded: TokenPayload;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
//   } catch {
//     return <p className="text-center mt-10 text-red-600">Token inválido</p>;
//   }

//   const partner = await prisma.partner.findUnique({
//     where: { id: decoded.partnerId },
//   });

//   const indications = await prisma.indication.findMany({
//     where: {
//       indicatedBy: {
//         partnerId: decoded.partnerId,
//       },
//     },
//     include: {
//       indicated: true,
//       indicatedBy: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     take: 10,
//   });

//   return (
//     <ProtectedLayout>
//       <main className="p-6  max-w-2xl">
//         <h1 className="text-2xl font-bold text-foreground mb-4">
//           Olá, {partner?.name}
//         </h1>

//         {/* <div className="flex justify-between">
//           <div className="p-2">
//             <h2 className="text-lg text-gray-700 font-semibold mb-2">
//               Clientes que mais indicaram
//             </h2>

//             {indications.length === 0 ? (
//               <p className="text-gray-500">Nenhuma indicação registrada.</p>
//             ) : (
//               <div className="overflow-x-auto border rounded-md">
//                 <table className="border-collapse border border-gray-400 w-full">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-4 py-2">Indicado</th>
//                       <th className="px-4 py-2">Indicado por</th>
//                       <th className="px-4 py-2">Procedimento</th>
//                       <th className="px-4 py-2">Valor</th>
//                       <th className="px-4 py-2">Comissão</th>
//                       <th className="px-4 py-2">Data da Indicação</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {indications.map((ind) => (
//                       <tr key={ind.id} className="border-t">
//                         <td className="px-4 py-2">{ind.indicated.name}</td>
//                         <td className="px-4 py-2">{ind.indicatedBy.name}</td>
//                         <td className="px-4 py-2">{ind.procedure}</td>
//                         <td className="px-4 py-2">
//                           R$ {Number(ind.planValue).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2">
//                           R$ {Number(ind.commissionValue).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2">
//                           {ind.indicated.createdAt.toString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//           </div>

//           <div className="p-2">
//             <h2 className="text-lg text-gray-700 font-semibold mb-2">
//               Últimas indicações
//             </h2>

//             {indications.length === 0 ? (
//               <p className="text-gray-500">Nenhuma indicação registrada.</p>
//             ) : (
//               <div className="overflow-x-auto border rounded-md">
//                 <table className="border-collapse border border-gray-400 w-full">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-4 py-2">Indicado</th>
//                       <th className="px-4 py-2">Indicado por</th>
//                       <th className="px-4 py-2">Procedimento</th>
//                       <th className="px-4 py-2">Valor</th>
//                       <th className="px-4 py-2">Comissão</th>
//                       <th className="px-4 py-2">Data da Indicação</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {indications.map((ind) => (
//                       <tr key={ind.id} className="border-t">
//                         <td className="px-4 py-2">{ind.indicated.name}</td>
//                         <td className="px-4 py-2">{ind.indicatedBy.name}</td>
//                         <td className="px-4 py-2">{ind.procedure}</td>
//                         <td className="px-4 py-2">
//                           R$ {Number(ind.planValue).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2">
//                           R$ {Number(ind.commissionValue).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2">
//                           {new Date(ind.indicated.createdAt).toLocaleString(
//                             "pt-BR",
//                             {
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                             }
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//           </div>


//         </div> */}

//         <div className="flex justify-center">
//           <div className="flex bg-gray-100 border-gray-300 rounded-lg p-4">
//             <Link href="/referrals/new" className="p-2">Nova indicação</Link>
//           </div>
//         </div>

//       </main>
//     </ProtectedLayout>
//   );
// }


// 'use client'

// import { useRouter } from 'next/navigation'
// import { PlusCircle, UserPlus, Wallet } from 'lucide-react'
// import { ProtectedLayout } from '../components/ProtectedLayout'

// export default function DashboardPage() {
//   const router = useRouter()

//   return (
//     <ProtectedLayout>

//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div
//             onClick={() => router.push('/referrals/new')}
//             className="cursor-pointer bg-cyan-800 text-white rounded-md p-6 text-center hover:bg-cyan-900 transition transform hover:scale-105 flex flex-col items-center gap-2"
//           >
//             <PlusCircle size={32} />
//             <span>Registrar Indicação</span>
//           </div>
//           <div
//             onClick={() => router.push('/balance/use')}
//             className="cursor-pointer bg-yellow-600 text-white rounded-md p-6 text-center hover:bg-yellow-700 transition transform hover:scale-105 flex flex-col items-center gap-2"
//           >
//             <Wallet size={32} />
//             <span>Registrar Uso de Saldo</span>
//           </div>
//           <div
//             onClick={() => router.push('/people/new')}
//             className="cursor-pointer bg-green-700 text-white rounded-md p-6 text-center hover:bg-green-800 transition transform hover:scale-105 flex flex-col items-center gap-2"
//           >
//             <UserPlus size={32} />
//             <span>Adicionar Cliente</span>
//           </div>
//         </div>
//       </div>
//     </ProtectedLayout>

//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, UserPlus, Wallet } from 'lucide-react'
import { ProtectedLayout } from '../components/ProtectedLayout'
import { formatPhone } from '@/utils/formatters'

interface TopPerson {
  id: string
  name: string
  phone: string
  balance: number
}

interface UpcomingExpiration {
  id: string
  procedure: string
  expiresIn: string
  person: {
    name: string
    phone: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [topPeople, setTopPeople] = useState<TopPerson[]>([])
  const [expiringIndications, setExpiringIndications] = useState<UpcomingExpiration[]>([])

  useEffect(() => {
    async function fetchData() {
      const topRes = await fetch('/api/people/top-balance')
      const topData = await topRes.json()
      console.log(topData);

      setTopPeople(topData)

      const expiringRes = await fetch('/api/indication/expiring')
      const expiringData = await expiringRes.json()
      setExpiringIndications(expiringData)
    }

    fetchData()
  }, [])

  return (
    <ProtectedLayout>
      <div className="mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div
            onClick={() => router.push('/referrals/new')}
            className="cursor-pointer bg-cyan-800 text-white rounded-md p-6 text-center hover:bg-cyan-900 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <PlusCircle size={32} />
            <span>Registrar Indicação</span>
          </div>
          <div
            onClick={() => router.push('/balance/use')}
            className="cursor-pointer bg-yellow-600 text-white rounded-md p-6 text-center hover:bg-yellow-700 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <Wallet size={32} />
            <span>Registrar Uso de Saldo</span>
          </div>
          <div
            onClick={() => router.push('/people/new')}
            className="cursor-pointer bg-green-700 text-white rounded-md p-6 text-center hover:bg-green-800 transition transform hover:scale-105 shadow-md flex flex-col items-center gap-2"
          >
            <UserPlus size={32} />
            <span>Adicionar Cliente</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Top 10 Clientes com Maior Saldo</h2>
            <ul className="divide-y">
              {topPeople.map((p) => (
                <li key={p.id} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{p.name} - {formatPhone(p.phone)}</span>
                  <span className="font-semibold text-green-700">R$ {p.balance.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Saldos a Vencer</h2>
            <ul className="divide-y">
              {expiringIndications.map((i) => (
                <li key={i.id} className="py-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{i.person.name} ({i.person.phone})</span>
                    <span className="text-sm text-red-600">Expira: {new Date(i.expiresIn).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="text-sm text-gray-500">Procedimento: {i.procedure}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
