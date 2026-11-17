"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Shield, Scale } from "lucide-react";
import { GradientOrb } from "@/components/interactive";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const legalPages = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/eula", label: "EULA / Software License" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/download-policy", label: "Download & Usage Policy" },
  { href: "/legal/ip", label: "Intellectual Property" },
  { href: "/legal/acceptable-use", label: "Acceptable Use Policy" },
  { href: "/legal/third-party", label: "Third-Party Disclosure" },
  { href: "/legal/security-reporting", label: "Security Reporting" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-30" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />
      <GradientOrb
        color="purple"
        size={360}
        opacity={0.14}
        blur={80}
        className="absolute -top-40 right-0"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass-strong gradient-border rounded-2xl p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-8 h-8 rounded-lg glass gradient-border flex items-center justify-center text-accent-blue">
                  <Shield className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Legal &amp; Policies
                </h2>
              </div>
              <nav className="space-y-1" aria-label="Legal documents">
                {legalPages.map((page) => {
                  const isActive = pathname === page.href;
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-300",
                        isActive
                          ? "text-accent-blue bg-accent-blue/10 shadow-[inset_0_0_20px_-8px_rgb(212_175_55_/_0.6)]"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/60"
                      )}
                    >
                      {/* Active gradient accent bar */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-accent-blue to-accent-purple transition-opacity duration-300",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="pl-1">{page.label}</span>
                      <ChevronRight
                        className={cn(
                          "w-3.5 h-3.5 shrink-0 transition-all duration-300",
                          isActive
                            ? "text-accent-blue opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-1"
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 px-2">
                <Scale className="w-3.5 h-3.5 text-text-muted" />
                <p className="text-[11px] text-text-muted">
                  Review periodically for updates.
                </p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <Reveal
              className={cn(
                "glass-strong gradient-border rounded-3xl p-7 sm:p-10",
                // Refined prose typography — scoped so legal page text stays verbatim.
                "[&_h1]:tracking-tight",
                "[&_h2]:tracking-tight [&_h2]:scroll-mt-24",
                "[&_p]:leading-relaxed",
                "[&_li]:marker:text-accent-blue/70",
                "[&_a]:underline [&_a]:decoration-accent-blue/40 [&_a]:underline-offset-4 [&_a]:transition-colors",
                "[&_div:has(>p.text-warning)]:rounded-xl [&_div:has(>p.text-warning)]:border [&_div:has(>p.text-warning)]:border-warning/25 [&_div:has(>p.text-warning)]:bg-warning/[0.06] [&_div:has(>p.text-warning)]:p-5",
                "[&_p.text-warning]:leading-relaxed"
              )}
            >
              {children}
            </Reveal>
          </main>
        </div>
      </div>
    </div>
  );
}
