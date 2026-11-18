"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FAQPageSchema } from "@/components/seo/StructuredData";
import { GradientOrb } from "@/components/interactive";
import { Reveal } from "@/components/motion/Reveal";
import {
  Search,
  HelpCircle,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "services", label: "Services" },
  { id: "products", label: "Products" },
  { id: "downloads", label: "Downloads" },
  { id: "installation", label: "Installation" },
  { id: "support", label: "Support" },
  { id: "privacy", label: "Privacy" },
  { id: "licensing", label: "Licensing" },
];

const faqs = [
  {
    id: "1",
    question: "What is SNU Automation?",
    answer:
      "SNU Automation is my personal brand for AI automation development, software products, and digital solutions. I build AI-powered applications, business automation systems, and workflow solutions.",
    category: "general",
  },
  {
    id: "2",
    question: "What services do you offer?",
    answer:
      "I offer AI automation development, business process automation, custom application development, workflow automation, AI integration, web development, desktop software development, and technical consultation.",
    category: "services",
  },
  {
    id: "3",
    question: "Are your software products free?",
    answer:
      "Some products are free, some are freemium (free with premium features), and some are paid. Each product page clearly indicates its license type and pricing.",
    category: "products",
  },
  {
    id: "4",
    question: "How do I download software?",
    answer:
      "Visit the Download Center, find your product, select your platform (Windows, Android, Linux, etc.), and click Download. Each download includes SHA-256 checksums for verification.",
    category: "downloads",
  },
  {
    id: "5",
    question: "How do I verify my download?",
    answer:
      "After downloading, compare the SHA-256 checksum of your file with the one provided on the product page. On Windows, use PowerShell: Get-FileHash -Algorithm SHA256 filename.exe",
    category: "installation",
  },
  {
    id: "6",
    question: "Do you provide technical support?",
    answer:
      "Yes, I provide support for all my software products. Visit the Support Center or contact me directly for assistance with installation, troubleshooting, or feature requests.",
    category: "support",
  },
  {
    id: "7",
    question: "How is my data handled?",
    answer:
      "Your data is processed with care. I follow privacy-by-design principles and only collect data necessary for the service. See the Privacy Policy for full details.",
    category: "privacy",
  },
  {
    id: "8",
    question: "Can I use your software commercially?",
    answer:
      "License terms vary by product. Free and open-source products may have different commercial use terms. Check the EULA and product page for specific licensing information.",
    category: "licensing",
  },
];

export default function FaqPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      <FAQPageSchema
        questions={filteredFaqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
      <GradientOrb
        color="purple"
        size={440}
        opacity={0.2}
        blur={80}
        float={!reduceMotion}
        className="absolute -top-40 -right-32"
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-6">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Find answers to common questions about my services, products,
              downloads, and support.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Search + Filter */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              aria-label="Search FAQs"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 glass border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20 focus:shadow-[0_0_26px_-10px_rgb(181_121_74_/_0.55)]"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {faqCategories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                className={cn(
                  "px-3.5 py-1.5 text-sm rounded-full transition-colors duration-300",
                  activeCategory === cat.id
                    ? "text-white bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_8px_24px_-12px_rgb(181_121_74_/_0.9)]"
                    : "glass text-text-secondary hover:text-text-primary hover:border-accent-blue/40"
                )}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openItems.has(faq.id);
            return (
              <div
                key={faq.id}
                className={cn(
                  "glass rounded-2xl overflow-hidden transition-colors duration-300",
                  isOpen && "border-accent-blue/30 glow-blue"
                )}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg glass gradient-border flex items-center justify-center text-accent-electric">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-base font-medium text-text-primary group-hover:text-accent-electric transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                    className="shrink-0 ml-3"
                  >
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary leading-relaxed pl-6 pr-6 pb-6 pt-0 border-l-2 border-accent-blue/30 ml-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-text-muted/40 mx-auto mb-4" />
              <p className="text-text-secondary">
                No FAQs found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center glass-strong rounded-3xl p-10">
          <MessageCircle className="w-8 h-8 text-accent-electric mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
            Still have questions?
          </h2>
          <p className="text-text-secondary mb-6">
            Can&apos;t find what you&apos;re looking for? Reach out directly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg hover:opacity-90 transition-opacity"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </div>
  );
}
