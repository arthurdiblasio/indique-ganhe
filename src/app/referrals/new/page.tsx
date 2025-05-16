"use client";

import { MoneyInput } from "@/app/components/MoneyInput";
import { PhoneInput } from "@/app/components/PhoneInput";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ProtectedLayout } from "@/app/components/ProtectedLayout";
import { useState } from "react";
// import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function NewReferralPage() {
  //   const router = useRouter()

  const [referrerPhone, setReferrerPhone] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referredNotFound, setReferredNotFound] = useState(false);
  const [referredPhone, setReferredPhone] = useState("");
  const [referredName, setReferredName] = useState("");
  const [referrerNotFound, setReferrerNotFound] = useState(false);
  const [procedure, setProcedure] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPerson = async (
    phone: string,
    setName: (n: string) => void,
    setNotFound: (b: boolean) => void
  ) => {
    console.log('phone', phone);
    if (phone) {
      const res = await fetch(`/api/people?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setNotFound(false);
      } else {
        setName("");
        setNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (referrerPhone && referredPhone && referrerPhone === referredPhone) {
      setError(
        "O telefone de quem indicou não pode ser igual ao da pessoa indicada."
      );
    } else {
      setError("");
    }
  }, [referrerPhone, referredPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (referrerPhone === referredPhone) {
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
        referrerPhone,
        referrerName,
        referredPhone,
        referredName,
        procedure,
        planValue: Number(planValue),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess("Indicação registrada com sucesso!");
      setReferrerPhone("");
      setReferrerName("");
      setReferredPhone("");
      setReferredName("");
      setProcedure("");
      setPlanValue("");
      setCommissionValue("");
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao registrar indicação");
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4">Nova Indicação</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Referrer */}
          <div>
            <label className="block text-sm">Telefone de quem indicou</label>
            <PhoneInput
              value={referrerPhone}
              onChange={(e) => setReferrerPhone(e.target.value)}
              onBlur={() =>
                fetchPerson(referrerPhone, setReferrerName, setReferrerNotFound)
              }
              placeholder="(99) 99999-9999"
              className="focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            {!referrerName && referrerNotFound && (
              <p className="text-sm text-yellow-600 mt-1">
                Nome de quem indicou não está cadastrado. Preencha corretamente para realizar o cadastro.
              </p>
            )}
            {!referrerNotFound ? (
              <p className="text-sm pt-1 text-gray-600">Nome: {referrerName}</p>
            ) : (
              <input
                type="text"
                placeholder="Nome de quem indicou"
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                className="w-full mt-2 pt-2 border p-2 rounded-md"
                required
              />
            )}
          </div>

          {/* Referred */}
          <div>
            <label className="block text-sm">Telefone da pessoa indicada</label>
            <PhoneInput
              value={referredPhone}
              onChange={(e) => setReferredPhone(e.target.value)}
              onBlur={() =>
                fetchPerson(referredPhone, setReferredName, setReferredNotFound)
              }
              placeholder="(99) 99999-9999"
              className="focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            {!referredName && referredNotFound && (
              <p className="text-sm text-yellow-600 mt-1">
                Nome do indicado não está cadastrado. Por favor, insira o nome
                para realizar o cadastro.
              </p>
            )}
            {!referredNotFound ? (
              <p className="text-sm pt-1 text-gray-600">Nome: {referredName}</p>
            ) : (
              <input
                type="text"
                placeholder="Nome da pessoa indicada"
                value={referredName}
                onChange={(e) => setReferredName(e.target.value)}
                className="w-full mt-2 border p-2 rounded-md"
                required
              />
            )}
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
            <label className="block text-sm">Valor do Plano</label>
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
            <button className="bg-red-800 text-white  hover:bg-red-900 py-2 px-4 rounded-md ">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
