"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthInitializer } from "@/providers/auth-initializer";
import { Sidebar } from "@/components/common/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  };

  return (
    <AuthInitializer>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          pathname={pathname}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleToggleCollapse}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen px-4">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </AuthInitializer>
  );
}
