"use client";

import { MoneyInput } from "@/app/components/MoneyInput";
import { PhoneInput } from "@/app/components/PhoneInput";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ProtectedLayout } from "@/app/components/ProtectedLayout";
import { useToast } from "@/app/hooks/useToast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function NewReferralPage() {

  const toast = useToast()
  const router = useRouter()

  const [clientPhone, setClientPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientBalance, setClientBalance] = useState("");
  const [referredPhone, setReferredPhone] = useState("");
  const [referredName, setReferredName] = useState("");
  const [clientNotFound, setClientNotFound] = useState(false);
  const [procedure, setProcedure] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPerson = async (
    phone: string,
    setName: (n: string) => void,
    setBalance: (b: string) => void,
    setNotFound: (b: boolean) => void
  ) => {
    if (phone) {
      const res = await fetch(`/api/people?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setBalance(data.balance.toString());
        setNotFound(false);
      } else {
        setName("");
        setBalance("");
        setNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (clientPhone && referredPhone && clientPhone === referredPhone) {
      setError(
        "O telefone de quem indicou não pode ser igual ao da pessoa indicada."
      );
    } else {
      setError("");
    }
  }, [clientPhone, referredPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (clientPhone === referredPhone) {
      setError(
        "O telefone de quem indicou não pode ser igual ao da pessoa indicada."
      );
      return;
    }

    setLoading(true);

    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        clientPhone: Number(clientPhone.replace(/\D/g, '')),
        clientName,
        referredPhone: Number(referredPhone.replace(/\D/g, '')),
        referredName,
        procedure,
        planValue: Number(planValue.replace(/\D/g, '')),
      }),
    });

    setLoading(false);

    if (!res.ok) return toast('Erro ao realizar indicação!', 'error')

    setSuccess("Indicação registrada com sucesso!");
    setClientPhone("");
    setClientName("");
    setReferredPhone("");
    setReferredName("");
    setProcedure("");
    setPlanValue("");
    setCommissionValue("");
    toast('Indicação registrada com sucesso!', 'success')
    router.push('/referrals/list')
  };

  return (
    <ProtectedLayout>
      <div className="mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4">Registro de uso de saldo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* client */}
          <div>
            <label className="block text-sm">Telefone de quem vai usar o saldo</label>
            <PhoneInput
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              onBlur={() =>
                fetchPerson(clientPhone, setClientName, setClientBalance, setClientNotFound)
              }
              placeholder="(99) 99999-9999"
              className="focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            {!clientName && clientNotFound && (
              <p className="text-sm text-yellow-600 mt-1">
                Não foi encontrado ninguém com esse telefone.
              </p>
            )}
            <div>
              <p className="text-base pt-1 text-gray-600">Nome: {clientName}</p>
              <p className="text-sm pt-1 text-green-600">Saldo: {clientBalance}</p>
            </div>
          </div>

          {/* Procedure */}
          <div>
            <label className="block text-sm">Procedimento</label>
            <input
              type="text"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          {/* Plan Value */}
          <div>
            <MoneyInput
              label="Valor do Plano"
              value={planValue}
              onChange={(formatted, numeric) => {
                setPlanValue(formatted)
                const commission = (numeric * 0.05).toFixed(2)
                setCommissionValue(commission)
              }}
              required
            />
            {commissionValue && (
              <p className="text-sm text-green-600 mt-1">
                Comissão (5%): R$ {commissionValue}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex justify-between">
            <PrimaryButton
              type="submit"
              className="font-semi-bold"
              isLoading={loading}
            >
              Registrar
            </PrimaryButton>
            <Link
              href="/referrals/list"
              className="block w-fit bg-red-800 text-white  hover:bg-red-900 py-3 px-4 rounded-md items-center justify-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
