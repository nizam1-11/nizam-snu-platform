import Script from "next/script";

interface PersonSchemaProps {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[];
}

export function PersonSchema({ name, url, image, jobTitle, sameAs }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    image,
    jobTitle: jobTitle || "AI Automation Developer & Software Creator",
    sameAs: sameAs || [],
    worksFor: {
      "@type": "Organization",
      name: "SNU Automation",
    },
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema({ name, url, logo }: { name: string; url: string; logo?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    founder: {
      "@type": "Person",
      name: "Nizam",
    },
  };

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema({
  name,
  description,
  applicationCategory,
  operatingSystem,
  offers,
}: {
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: { price: string; priceCurrency: string };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: applicationCategory || "DeveloperApplication",
    operatingSystem,
    offers: offers
      ? {
          "@type": "Offer",
          price: offers.price,
          priceCurrency: offers.priceCurrency,
        }
      : undefined,
  };

  return (
    <Script
      id="software-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished,
    url,
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}