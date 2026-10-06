"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  NAVIGATION_ITEMS,
  BOTTOM_NAVIGATION_ITEMS,
  NavItem,
} from "@/data/navigation";
import { SidebarProps } from "@/types/common.types";
import { useAuth } from "@/hooks/useAuth";
import { EStaffRole } from "@/types/auth/auth.types";

function NavLinkList({
  items,
  pathname,
  isCollapsed = false,
}: {
  items: NavItem[];
  pathname: string;
  isCollapsed?: boolean;
}) {
  return (
    <>
      {items?.map((item) => {
        const isActive = pathname === item?.href;
        return (
          <Link
            key={item?.name}
            href={item?.href}
            title={isCollapsed ? item?.name : undefined}
            className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center px-0 w-12 mx-auto" : "gap-3 px-4"
            } ${
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}>
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{item?.name}</span>}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar({
  pathname,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const { user } = useAuth();

  const isItemVisible = (item: NavItem) => {
    const isSalesman =
      user?.role === EStaffRole.SALESMAN ||
      (Array.isArray(user?.permissions) && user?.permissions?.length > 0);

    if (item?.adminOnly && isSalesman) {
      return false;
    }

    if (isSalesman && item?.permission) {
      const permissions = user?.permissions || [];
      return permissions.includes(item?.permission);
    }

    return true;
  };

  const visibleNavItems = NAVIGATION_ITEMS.filter(isItemVisible);
  const visibleBottomItems = BOTTOM_NAVIGATION_ITEMS.filter(isItemVisible);

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col shrink-0 bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "w-20" : "w-56"}`}>
      <div
        className={`flex h-16 items-center justify-between border-b border-border px-4 text-primary font-bold ${isCollapsed ? "justify-center" : ""}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {!isCollapsed && (
            <span className="font-serif text-lg tracking-wide truncate">
              Shelly Indian Foods
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-9 w-9 rounded-xl border border-border bg-background shadow-sm hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <nav className="flex-1 space-y-1">
          <NavLinkList
            items={visibleNavItems}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        </nav>

        <div className="border-t border-border pt-4 mt-auto space-y-1">
          <NavLinkList
            items={visibleBottomItems}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </aside>
  );
}
