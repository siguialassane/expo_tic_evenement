"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IdCard, LayoutDashboard, LogOut, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/badges",
    label: "Génération de badge",
    icon: IdCard,
  },
] as const;

interface AdminShellProps {
  children: ReactNode;
  onLogout: () => void | Promise<void>;
  subtitle: string;
  title: string;
  userEmail: string;
  contentClassName?: string;
  headerNote?: string | null;
  showPageIntro?: boolean;
}

export function AdminShell({
  children,
  onLogout,
  subtitle,
  title,
  userEmail,
  contentClassName,
  headerNote = "Le menu badge prepare le terrain pour l'export PDF sans changer le workflow d'inscription.",
  showPageIntro = true,
}: AdminShellProps) {
  const pathname = usePathname();
  const activeNavIndex = adminNavItems.findIndex((item) => {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6faf6_0%,#edf7ef_42%,#f8fbf8_100%)]">
      <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-4 md:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="shrink-0">
                <Image
                  src="/expoTic.jpeg"
                  alt="ExpoTic"
                  width={112}
                  height={34}
                  className="h-auto w-[108px] object-contain"
                />
              </Link>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  Administration
                </p>
                <p className="text-sm text-slate-500">Espace interne ExpoTic 2026</p>
              </div>
            </div>

            <nav className="relative grid grid-cols-2 items-center rounded-full border border-emerald-100 bg-slate-100/80 p-1 shadow-inner shadow-emerald-100/60">
              <motion.div
                aria-hidden="true"
                className="absolute bottom-1 top-1 rounded-full bg-white shadow-sm ring-1 ring-emerald-100"
                initial={false}
                animate={{
                  width: "calc(50% - 4px)",
                  x: activeNavIndex > 0 ? "100%" : "0%",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
              />

              {adminNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative z-10 inline-flex min-w-[164px] items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-emerald-700"
                        : "text-slate-600 hover:text-emerald-700"
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start xl:self-auto">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700">
              <UserCircle size={18} className="text-slate-500" />
              <span className="max-w-[240px] truncate">{userEmail}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2 border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={14} />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <main className={cn("mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:py-10 xl:px-10", contentClassName)}>
        {showPageIntro ? (
          <div className="mb-8 flex flex-col gap-3 rounded-[28px] border border-emerald-100/80 bg-white/80 px-6 py-6 shadow-[0_16px_40px_rgba(15,118,51,0.08)] backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                Administration ExpoTic
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {subtitle}
              </p>
            </div>
            {headerNote ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
                {headerNote}
              </div>
            ) : null}
          </div>
        ) : null}

        {children}
      </main>
    </div>
  );
}