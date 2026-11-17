export default function RefundPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Refund & Cancellation Policy</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. Refund Eligibility</h2>
          <p>Refunds may be available for paid software products within 14 days of purchase, provided the software has not been extensively used.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Non-Refundable Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Products that have been downloaded and used extensively</li>
            <li>Custom development services already rendered</li>
            <li>Products purchased more than 14 days ago</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. How to Request a Refund</h2>
          <p>Contact us via the Contact page with your purchase details and reason for the refund request.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Processing Time</h2>
          <p>Approved refunds will be processed within 5-10 business days.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing. Adjust based on your actual payment terms.</p>
        </div>
      </div>
    </div>
  );
}