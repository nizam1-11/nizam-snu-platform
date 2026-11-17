export default function AcceptableUsePage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Acceptable Use Policy</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. Permitted Use</h2>
          <p>You may use this website and its software for lawful purposes only, in accordance with these terms and applicable laws.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attempting to gain unauthorized access to the website or its systems</li>
            <li>Using the website to distribute malware or harmful content</li>
            <li>Scraping or harvesting data without permission</li>
            <li>Interfering with the website's operation or security</li>
            <li>Using the website for any illegal purpose</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Enforcement</h2>
          <p>Violations may result in termination of access and legal action if necessary.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}