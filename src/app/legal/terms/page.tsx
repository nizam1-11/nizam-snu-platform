export default function TermsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">
        Terms of Service
      </h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Use of Website</h2>
          <p>You may use this website for lawful purposes only. You agree not to use the website in any way that could damage, disable, or impair the website or interfere with any other party's use.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Intellectual Property</h2>
          <p>All content, software, and materials on this website are the property of Nizam / SNU Automation unless otherwise stated. Unauthorized reproduction or distribution is prohibited.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Software Downloads</h2>
          <p>Software downloaded from this website is subject to the End User License Agreement (EULA). You agree to use downloaded software in accordance with its license terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">5. Disclaimer of Warranties</h2>
          <p>This website and its content are provided "as is" without warranties of any kind, either express or implied.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">6. Limitation of Liability</h2>
          <p>Nizam / SNU Automation shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or software.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be posted on this page.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}