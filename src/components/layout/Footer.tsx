import Link from "next/link";
import { Mail } from "lucide-react";

// Social icons (inline SVG since lucide removed brand icons)
const GithubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const footerLinks = {
  Product: [
    { href: "/products", label: "Products" },
    { href: "/download", label: "Download Center" },
    { href: "/whats-new", label: "What's New" },
    { href: "/support", label: "Support" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/cookies", label: "Cookie Policy" },
    { href: "/legal/eula", label: "EULA" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
  ],
  Resources: [
    { href: "/faq", label: "FAQ" },
    { href: "/legal/download-policy", label: "Download Policy" },
    { href: "/legal/security-reporting", label: "Security Reporting" },
  ],
};

const socialLinkClass =
  "grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-white/[0.03] text-text-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent-electric/40 hover:bg-surface-elevated hover:text-accent-electric hover:shadow-[0_8px_24px_-8px_rgba(54,217,245,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-border/60 bg-surface-deep/80">
      {/* Ambient glow + subtle top gradient divider */}
      <div className="pointer-events-none absolute -top-28 left-1/3 h-56 w-1/3 rounded-full bg-accent-purple/10 blur-3xl" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent" />

      <div className="section-container relative py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-text-primary">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-text-secondary transition-colors duration-200 hover:text-accent-electric"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-border/60 pt-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-xs font-bold text-white">
              N
            </div>
            <span className="text-sm text-text-muted">
              © {new Date().getFullYear()} Syed Nizam Uddin — SNU Automation. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://github.com" className={socialLinkClass} aria-label="GitHub">
              <GithubIcon />
            </Link>
            <Link href="https://linkedin.com" className={socialLinkClass} aria-label="LinkedIn">
              <LinkedinIcon />
            </Link>
            <Link href="https://twitter.com" className={socialLinkClass} aria-label="Twitter">
              <TwitterIcon />
            </Link>
            <Link
              href="mailto:nizam14010@gmail.com"
              className={socialLinkClass}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
