'use client';

import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

import { ProtectedLayout } from "@/app/components/ProtectedLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function DashboardPage() {


  const [indications, setIndications] = useState<Indication[]>([])

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      await getIndications(setIndications).catch(console.error)
    }

    const token = Cookies.get('token');
    if (!token) router.push("/login");

    fetchData()
  }, [router])
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

async function getIndications(setIndications: (indication: Indication[]) => void) {
  const response = await fetch("/api/referrals", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch indications");
  }

  const indications = await response.json()

  setIndications(indications);
}

