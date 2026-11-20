const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://nizam-snu-platform.nizam-snu-platform.workers.dev";

export async function GET() {
  const body = `# Syed Nizam Uddin — SNU Automation

> Independent developer building AI-powered applications, automation systems and software products.

## Key pages
- Home: ${BASE_URL}/
- About: ${BASE_URL}/about
- Services: ${BASE_URL}/services
- Projects: ${BASE_URL}/projects
- Products: ${BASE_URL}/products
- Download: ${BASE_URL}/download
- Blog: ${BASE_URL}/blog
- What's New: ${BASE_URL}/whats-new
- Contact: ${BASE_URL}/contact

## Products
SNU Automation is a Windows desktop app for bulk video downloading, Facebook Page scheduling with safety pacing, and a 12-node visual workflow builder. An AI assistant (Gemini, Claude, GPT) can act on real services. Data is stored locally in a SQLite database.

## Contact
- Contact page: ${BASE_URL}/contact
- WhatsApp: +923239163815
- GitHub: https://github.com/nizam1-11

## Content use
You may summarize and cite this site with attribution to Syed Nizam Uddin / SNU Automation.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
