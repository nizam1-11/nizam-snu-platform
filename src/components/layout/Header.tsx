"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/showcase", label: "Showcase" },
  { href: "/download", label: "Download" },
  { href: "/whats-new", label: "What's New" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile sheet on navigation or Escape.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-strong border-b border-border/80 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.85)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="section-container" aria-label="Primary">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-accent-electric"
          >
            <img
              src="/images/snu-logo.png"
              alt="SNU Automation"
              width={512}
              height={512}
              className="h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3"
            />
            <span className="font-heading text-lg font-semibold tracking-tight text-text-primary">
              Nizam
            </span>
            <span className="hidden text-sm text-text-muted transition-colors group-hover:text-text-secondary sm:inline">
              / SNU Automation
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm transition-all duration-300",
                    "hover:-translate-y-0.5 hover:bg-surface-elevated/60",
                    active
                      ? "font-medium text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border bg-bg-base/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="section-container space-y-1 py-4" aria-label="Mobile">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base transition-colors focus-visible:ring-2 focus-visible:ring-accent-electric",
                      active
                        ? "bg-surface-elevated/70 font-medium text-text-primary"
                        : "text-text-secondary hover:bg-surface-elevated/60 hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
