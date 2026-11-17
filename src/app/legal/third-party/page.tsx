export default function ThirdPartyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Third-Party Services Disclosure</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">Services Used</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cloudflare:</strong> Website hosting, CDN, DNS, D1 database, R2 storage, Web Analytics</li>
            <li><strong>GitHub:</strong> Source code hosting, release distribution</li>
            <li><strong>Resend:</strong> Email delivery for contact form notifications</li>
            <li><strong>Google Fonts:</strong> Typography (Inter, Space Grotesk)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">Data Sharing</h2>
          <p>We only share data with third-party services as necessary to provide our services. Each service has its own privacy policy.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}