"use client";

import { Coins, House, MoveLeft, MoveRight, PlusCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar({
  isExpanded,
  toggleSidebar,
}: {
  isExpanded: boolean;
  toggleSidebar: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <aside className="h-screen border-r border-gray-200 bg-gray-100 transition-all duration-300">
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <span className="font-bold text-primary text-sm pr-2 truncate">
          {isExpanded ? "Indique e Ganhe" : <Coins className="pr-2" size={30} />}
        </span>
        <button
          className="text-xs text-gray-600 hidden md:block"
          onClick={toggleSidebar}
        >
          {isExpanded ? <MoveLeft className="cursor-pointer" size={18} /> : <MoveRight className="cursor-pointer" size={18} />}
        </button>
      </div>

      <nav className="flex flex-col mt-4 gap-3 px-4 text-base text-gray-800">
        <a href="/dashboard" className="hover:text-gray-950 truncate hover:font-bold font-semi-bold">
          {isExpanded ? "Dashboard" : <House size={30} />}
        </a>
        <a href="/referrals/list" className="hover:text-gray-950 truncate hover:font-bold font-semi-bold">
          {isExpanded ? "Indicações" : <PlusCircle size={30} />}
        </a>
        <a href="/persons/new" className="hover:text-gray-950 truncate hover:font-bold font-semi-bold">
          {isExpanded ? "Pessoas" : <UserPlus size={30} />}
        </a>
      </nav>

      <div className="absolute bottom-4 left-4">
        <button
          onClick={handleLogout}
          className="text-red-600 text-sm hover:underline truncate"
        >
          {isExpanded ? "Sair" : "🚪"}
        </button>
      </div>
    </aside>
  );
}
