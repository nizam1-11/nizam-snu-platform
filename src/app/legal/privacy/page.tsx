export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">
        Privacy Policy
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Last updated: November 2026
      </p>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            1. Introduction
          </h2>
          <p>
            This Privacy Policy describes how Nizam / SNU Automation
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses,
            and protects your personal information when you visit our website and
            use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            2. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Contact Information:</strong> Name, email address, and
              message content when you submit a contact form.
            </li>
            <li>
              <strong>Usage Data:</strong> Browser type, operating system,
              referring URLs, and pages visited (via Cloudflare Web Analytics).
            </li>
            <li>
              <strong>Download Data:</strong> Download counts and platform
              information for software distribution.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To respond to your inquiries and provide support</li>
            <li>To improve our website and services</li>
            <li>To analyze usage patterns and optimize performance</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            4. Data Storage & Security
          </h2>
          <p>
            Your data is stored securely using Cloudflare&apos;s infrastructure.
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            5. Third-Party Services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Cloudflare:</strong> Hosting, CDN, analytics, and security
            </li>
            <li>
              <strong>Resend:</strong> Email delivery for contact form notifications
            </li>
            <li>
              <strong>GitHub:</strong> Software release distribution
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            6. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            To exercise these rights, contact us at the email provided on our
            Contact page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            7. Cookies
          </h2>
          <p>
            We use minimal cookies for essential functionality. See our Cookie
            Policy for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
            9. Contact
          </h2>
          <p>
            For privacy-related questions, contact us via our{" "}
            <a href="/contact" className="text-accent-electric hover:text-accent-blue">
              Contact page
            </a>
            .
          </p>
        </section>

        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">
            ⚠️ This is a template. Please review with a qualified legal
            professional before publishing, especially regarding GDPR, CCPA, or
            other applicable privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}