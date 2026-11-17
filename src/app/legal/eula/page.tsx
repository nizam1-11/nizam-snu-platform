export default function EulaPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">End User License Agreement (EULA)</h1>
      <p className="text-sm text-text-secondary mb-8">Last updated: November 2026</p>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">1. License Grant</h2>
          <p>Subject to the terms of this EULA, Nizam / SNU Automation grants you a non-exclusive, non-transferable license to use the software for personal or commercial purposes as specified by the product's license type.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">2. Restrictions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may not reverse engineer, decompile, or disassemble the software.</li>
            <li>You may not redistribute or resell the software without permission.</li>
            <li>You may not remove or modify any proprietary notices.</li>
            <li>You may not use the software for illegal purposes.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">3. Intellectual Property</h2>
          <p>The software and all related documentation are the intellectual property of Nizam / SNU Automation.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">4. Disclaimer of Warranty</h2>
          <p>The software is provided "as is" without warranty of any kind. Nizam / SNU Automation disclaims all warranties, express or implied.</p>
        </section>
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-3">5. Limitation of Liability</h2>
          <p>In no event shall Nizam / SNU Automation be liable for any damages arising from the use or inability to use the software.</p>
        </section>
        <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning">⚠️ This is a template. Please review with a qualified legal professional before publishing.</p>
        </div>
      </div>
    </div>
  );
}