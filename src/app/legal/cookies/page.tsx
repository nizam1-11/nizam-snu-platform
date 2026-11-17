export default function CookiePolicyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Cookie Policy</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function (session management, authentication).</li>
            <li><strong>Analytics Cookies:</strong> Cloudflare Web Analytics uses minimal, privacy-friendly tracking without cookies.</li>
            <li><strong>Preference Cookies:</strong> Remember your theme preference (dark/light mode).</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling cookies may affect website functionality.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Third-Party Cookies</h2>
          <p>We do not use third-party advertising cookies. Cloudflare may set cookies for security and performance purposes.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}