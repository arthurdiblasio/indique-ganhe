"use client";

import { MoneyInput } from "@/app/components/MoneyInput";
import { PhoneInput } from "@/app/components/PhoneInput";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ProtectedLayout } from "@/app/components/ProtectedLayout";
import { useToast } from "@/app/hooks/useToast";
import { formatMoney } from "@/utils/formatters";
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
  const [clientBalance, setClientBalance] = useState(0);
  const [clientNotFound, setClientNotFound] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPerson, setLoadingPerson] = useState(false);

  const fetchPerson = async (
    phone: string,
    setName: (n: string) => void,
    setBalance: (b: number) => void,
    setNotFound: (b: boolean) => void
  ) => {
    if (phone) {
      setLoadingPerson(true);
      const res = await fetch(`/api/people?phone=${phone}`);
      setLoadingPerson(false);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setBalance(data.balance.toString());
        setNotFound(false);
      } else {
        setName("");
        setBalance(0);
        setNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (Number(value.replace(/\D/g, '')) / 100 > clientBalance) {
      setError(
        "O valor inserido é maior do que o saldo disponível."
      );
    } else {
      setError("");
    }
  }, [value, clientBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const valueNumber = Number(value.replace(/\D/g, '')) / 100

    if (!valueNumber || valueNumber > clientBalance) {
      setLoading(false);
      setError('Valor de saldo inválido')
      return
    }


    const res = await fetch("/api/balance/use", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        value: valueNumber,
        phone: clientPhone,
      }),
    });

    setLoading(false);

    if (!res.ok) return toast('Erro ao realizar uso de saldo!', 'error')

    setClientPhone("");
    setClientName("");
    setValue("");
    setSuccess("Uso de saldo realizado com sucesso!");
    toast('Uso de saldo realizado com sucesso!', 'success')
    router.push('/dashboard')
  };

  return (
    <ProtectedLayout>
      <div className="mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-xl">
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
            {loadingPerson && (
              <p className="text-sm text-gray-500 mt-1">Carregando cliente...</p>
            )}
            {clientName && <div>
              <p className="text-base pt-1 text-gray-600">Nome: {clientName}</p>
              <p className="text-sm pt-1 text-green-600">Saldo: {formatMoney(clientBalance.toString())}</p>
            </div>}
          </div>

          {/* Value */}
          <div>
            {clientName && (
              <MoneyInput
                label="Valor à usar"
                value={value}
                max={clientBalance}
                onChange={(formatted, numeric) => {
                  const result = clientBalance - numeric;
                  if (result <= 0) {
                    setError("Saldo insuficiente");
                  } else {
                    setError("");
                  }

                  setValue(formatted)
                }}
                required
              />)}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex justify-between">
            <PrimaryButton
              type="submit"
              className="font-semi-bold"
              isLoading={loading}
              disabled={!clientName || !value || !!error || loading}
            >
              Registrar
            </PrimaryButton>
            <Link
              href="/dashboard"
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
