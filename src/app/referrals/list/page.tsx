import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProtectedLayout } from "@/app/components/ProtectedLayout";
import Link from "next/link";

interface Indication {
  id: string;
  procedure: string;
  planValue: number;
  commissionValue: number;
  indicated: {
    name: string;
    createdAt: string;
  };
  indicatedBy: {
    name: string;
  };
}

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  const indications: Indication[] = await getIndications();

  return (
    <ProtectedLayout>
      <main className="mx-1 pt-3 px-0">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 ">Indicações</h2>
          <Link
            href="/referrals/new"
            className="block w-fit bg-cyan-800 text-white hover:bg-cyan-900 py-2 px-4 rounded-md text-center"
          >
            Nova Indicação
          </Link>
        </div>

        {indications.length === 0 ? (
          <p className="text-gray-500">Nenhuma indicação registrada.</p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="border-collapse border border-gray-400 w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Indicado</th>
                  <th className="text-left px-4 py-2">Indicado por</th>
                  <th className="text-left px-4 py-2">Procedimento</th>
                  <th className="text-left px-4 py-2">Valor</th>
                  <th className="text-left px-4 py-2">Comissão</th>
                  <th className="text-left px-4 py-2">Data da Indicação</th>
                </tr>
              </thead>
              <tbody>
                {indications.map((ind) => (
                  <tr key={ind.id} className="border-t">
                    <td className="px-4 py-2">{ind.indicated.name}</td>
                    <td className="px-4 py-2">{ind.indicatedBy.name}</td>
                    <td className="px-4 py-2">{ind.procedure}</td>
                    <td className="px-4 py-2">
                      <div className="text-sm">
                        R$ {Number(ind.planValue).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-emerald-700">
                      R$ {Number(ind.commissionValue).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(ind.indicated.createdAt).toLocaleString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </ProtectedLayout>
  );
}
async function getIndications() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/referrals`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) throw new Error("Erro ao buscar as indicações");

  const indications: Indication[] = await response.json();
  return indications;
}
