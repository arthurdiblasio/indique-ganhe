"use client";

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
        <span className="font-bold text-primary text-sm pr-1 truncate">
          {isExpanded ? "Indique e Ganhe" : "🎯"}
        </span>
        <button
          className="text-xs text-gray-600 hidden md:block"
          onClick={toggleSidebar}
        >
          {isExpanded ? "←" : "→"}
        </button>
      </div>

      <nav className="flex flex-col mt-4 gap-3 px-4 text-sm text-gray-700">
        <a href="/dashboard" className="hover:text-primary truncate">
          {isExpanded ? "Dashboard" : "🏠"}
        </a>
        <a href="/referrals/list" className="hover:text-primary truncate">
          {isExpanded ? "Indicações" : "➕"}
        </a>
        <a href="/persons/new" className="hover:text-primary truncate">
          {isExpanded ? "Pessoas" : "👤"}
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
