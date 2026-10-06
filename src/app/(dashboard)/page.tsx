"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Tag, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function OverviewPage() {
  const { user } = useAuth();

  const workingTabs = [
    {
      name: "Categories",
      description:
        "Manage product groupings, tags, and classification hierarchies.",
      href: ROUTES.CATEGORIES.ROOT,
      icon: Tag,
      color:
        "text-blue-600 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
    },
    {
      name: "Products",
      description:
        "Review catalogue inventory, update pack pricing, and add details.",
      href: ROUTES.PRODUCTS.ROOT,
      icon: Package,
      color:
        "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
    },
    {
      name: "Orders",
      description:
        "Track wholesale order status updates and review client requests.",
      href: ROUTES.ORDERS.ROOT,
      icon: ShoppingBag,
      color:
        "text-amber-600 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 py-5">
      <div>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here is your business overview for Shelly Indian Foods today.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-4xl">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Dashboard Overview In Development
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The main charts overview dashboard is currently under active
          development. Please use the functional tabs below to manage your
          operations:
        </p>

        <div className="grid gap-6 mt-8 sm:grid-cols-3">
          {workingTabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${tab.color}`}>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-sm border border-border/40">
                  <tab.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold mt-4 text-foreground">
                  {tab.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {tab.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold mt-6">
                <span>Manage</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
