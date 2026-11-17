export default function DisclaimerPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Disclaimer</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. General Disclaimer</h2>
          <p>The information provided on this website is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Software Disclaimer</h2>
          <p>Software provided on this website is provided "as is" without warranty of any kind. Use at your own risk. We are not responsible for any damage, data loss, or other issues arising from the use of our software.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. External Links</h2>
          <p>This website may contain links to external websites. We are not responsible for the content or privacy practices of those sites.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Professional Advice</h2>
          <p>The content on this website does not constitute professional advice. Always consult qualified professionals for specific advice.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}