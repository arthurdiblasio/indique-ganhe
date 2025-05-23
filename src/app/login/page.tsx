"use client";

// import { useState } from "react";
import { redirect } from "next/navigation";
// import { PrimaryButton } from "../components/PrimaryButton";

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);
  // const [error, setError] = useState("");
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  redirect('/dashboard')

  // const handleSubmit = async (e: React.FormEvent) => {
  //   setLoading(true);


  //   //   e.preventDefault();

  //   //   const res = await fetch("/api/auth/login", {
  //   //     method: "POST",
  //   //     credentials: "include",
  //   //     headers: { "Content-Type": "application/json" },
  //   //     body: JSON.stringify({ email, password, remember }),
  //   //   });

  //   //   setLoading(false);
  //   //   if (res.ok) {
  //   //     router.push("/dashboard");
  //   //   } else {
  //   //     const data = await res.json();
  //   //     setError(data.error || "Erro ao fazer login");
  //   //   }
  //   // };

  //   // return (
  //   //   <div className="min-h-screen bg-background flex items-center justify-center px-4">
  //   //     <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-10 w-full max-w-md">
  //   //       <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
  //   //         🎯 Indique e Ganhe
  //   //       </h1>

  //   //       <form onSubmit={handleSubmit} className="space-y-5">
  //   //         <div>
  //   //           <label className="block mb-1 text-sm text-gray-700">Email</label>
  //   //           <input
  //   //             type="email"
  //   //             value={email}
  //   //             onChange={(e) => setEmail(e.target.value)}
  //   //             className="w-full border border-gray-300 text-foreground p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  //   //             required
  //   //           />
  //   //         </div>

  //   //         <div>
  //   //           <label className="block mb-1 text-sm text-gray-700">Senha</label>
  //   //           <input
  //   //             type="password"
  //   //             value={password}
  //   //             onChange={(e) => setPassword(e.target.value)}
  //   //             className="w-full border border-gray-300 text-foreground p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  //   //             required
  //   //           />
  //   //         </div>

  //   //         <div className="flex items-center gap-2 text-sm text-gray-600">
  //   //           <input
  //   //             id="remember"
  //   //             type="checkbox"
  //   //             checked={remember}
  //   //             onChange={(e) => setRemember(e.target.checked)}
  //   //           />
  //   //           <label htmlFor="remember">Manter conectado</label>
  //   //         </div>

  //   //         {error && <p className="text-red-600 text-sm">{error}</p>}

  //   //         <PrimaryButton
  //   //           type="submit"
  //   //           className="w-full font-semi-bold"
  //   //           isLoading={loading}
  //   //         >
  //   //           Entrar
  //   //         </PrimaryButton>
  //   //       </form>
  //   //     </div>
  //   //   </div>
  //   // );
  // }

}
