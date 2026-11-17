export default function SecurityReportingPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Security & Vulnerability Reporting Policy</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. Reporting a Vulnerability</h2>
          <p>If you discover a security vulnerability, please report it responsibly. Do not publicly disclose the vulnerability until it has been addressed.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. How to Report</h2>
          <p>Contact us via the Contact page with the subject "Security Vulnerability Report." Include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Description of the vulnerability</li>
            <li>Steps to reproduce</li>
            <li>Potential impact</li>
            <li>Your contact information (optional)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Our Commitment</h2>
          <p>We will acknowledge receipt within 48 hours and work to address the issue promptly. We will not take legal action against researchers who follow responsible disclosure practices.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Scope</h2>
          <p>This policy applies to the website and its associated services. It does not cover third-party services or dependencies.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}