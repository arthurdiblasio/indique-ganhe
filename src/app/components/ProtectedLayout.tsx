"use client";

import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isExpanded ? "16rem" : "5rem";

  return (
    <div
      className="grid min-h-screen transition-all"
      style={{
        gridTemplateColumns: `${sidebarWidth} 1fr`,
      }}
    >
      <Sidebar
        isExpanded={isExpanded}
        toggleSidebar={() => setIsExpanded((prev) => !prev)}
      />
      <main className="p-6 bg-background text-foreground">{children}</main>
    </div>
  );
}
