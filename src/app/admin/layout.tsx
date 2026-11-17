"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  FileText,
  HelpCircle,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-bg-secondary border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-[0_8px_24px_-10px_rgb(212_175_55_/_0.9)]">
                N
                <Sparkles className="w-2.5 h-2.5 absolute -top-1 -right-1 text-accent-cyan" />
              </div>
              <div className="leading-tight">
                <span className="block font-heading font-semibold text-text-primary">
                  Admin
                </span>
                <span className="block text-[10px] text-text-muted">
                  SNU Automation
                </span>
              </div>
            </Link>
            <button
              aria-label="Close navigation"
              className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section label */}
          <p className="px-6 pt-6 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Workspace
          </p>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {adminNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue",
                    isActive
                      ? "text-accent-blue bg-accent-blue/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/60"
                  )}
                >
                  {/* Active gradient accent bar */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gradient-to-b from-accent-blue to-accent-purple transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-accent-blue")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User card */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass">
              <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-accent-blue/40">
                <Image
                  src="/images/profile.jpg"
                  alt="Nizam"
                  fill
                  sizes="36px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  Nizam
                </p>
                <p className="text-xs text-text-muted truncate">
                  nizam14010@gmail.com
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgb(52_211_153_/_0.8)]" aria-label="Active" />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-text-secondary hover:text-text-primary rounded-xl hover:bg-surface-elevated/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <LogOut className="w-4 h-4" />
              View Site
              <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-bg-secondary/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6">
          <button
            aria-label="Open navigation"
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 ml-auto">
            <span className="inline-flex items-center gap-2 text-xs text-text-secondary glass rounded-full px-3 py-1.5">
              <Shield className="w-3.5 h-3.5 text-accent-electric" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-atmosphere min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
