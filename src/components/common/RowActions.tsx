"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface RowActionsProps {
  actions: RowAction[];
  id?: string;
}

export function RowActions({ actions, id }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div className="flex justify-start" onClick={(e) => e.stopPropagation()}>
        <button
          ref={btnRef}
          id={id}
          onClick={handleToggle}
          className={`p-2 rounded-lg hover:bg-muted transition-all duration-150 text-muted-foreground hover:text-foreground cursor-pointer ${
            open
              ? "opacity-100 bg-muted text-foreground"
              : "opacity-0 group-hover:opacity-100"
          }`}
          title="Actions">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", top: coords.top, right: coords.right }}
          className="z-50 min-w-[150px] rounded-xl border border-border bg-card shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-100 ">
          {actions?.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted text-left cursor-pointer ${
                action.variant === "danger"
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground"
              }`}>
              {action.icon && (
                <span className="size-4 flex-shrink-0">{action.icon}</span>
              )}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default RowActions;
