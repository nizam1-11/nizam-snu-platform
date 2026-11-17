export default function DownloadPolicyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Download & Software Usage Policy</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. Download Safety</h2>
          <p>All software downloads include SHA-256 checksums for verification. We recommend verifying your download before installation.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. System Requirements</h2>
          <p>Ensure your system meets the minimum requirements listed on each product page before downloading.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Version History</h2>
          <p>Previous versions are available when appropriate. We recommend using the latest stable version for security and performance.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Prohibited Uses</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Redistributing downloaded software without permission</li>
            <li>Using software for illegal or harmful purposes</li>
            <li>Attempting to reverse engineer or modify the software</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">5. No Warranty</h2>
          <p>Downloaded software is provided "as is" without warranty. Use at your own risk.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}