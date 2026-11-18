"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Mail,
  Send,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  FormSuccessSparkle,
  GradientOrb,
} from "@/components/interactive";
import { WhatsAppIcon } from "@/components/interactive/WhatsAppButton";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "project", label: "Project Request" },
  { value: "service", label: "Service Inquiry" },
  { value: "support", label: "Technical Support" },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "nizam14010@gmail.com",
    href: "mailto:nizam14010@gmail.com",
  },
  {
    icon: Globe,
    title: "Location",
    value: "Remote / Worldwide",
    href: null,
  },
  {
    icon: MessageSquare,
    title: "Response Time",
    value: "Within 24-48 hours",
    href: null,
  },
];

const inputClass =
  "w-full bg-surface/60 border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20 focus:shadow-[0_0_26px_-10px_rgb(181_121_74_/_0.55)]";

export default function ContactPage() {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-0 bg-atmosphere opacity-40" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
      <GradientOrb
        color="blue"
        size={420}
        opacity={0.22}
        blur={70}
        float={!reduceMotion}
        className="absolute -top-40 -left-32"
      />
      <GradientOrb
        color="purple"
        size={380}
        opacity={0.18}
        blur={80}
        float={!reduceMotion}
        className="absolute -bottom-40 -right-24"
      />

      <section className="relative section-container py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left branded info panel */}
          <Reveal direction="right" className="lg:col-span-2">
            <div className="glass-strong gradient-border relative overflow-hidden rounded-3xl p-8 sm:p-10 h-full flex flex-col">
              <GradientOrb
                color="blue"
                size={260}
                opacity={0.4}
                blur={50}
                float={!reduceMotion}
                className="absolute -top-20 -right-20"
              />
              <div className="relative z-10 flex-1">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-accent-cyan glass mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Let&apos;s build something
                </span>

                <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight text-text-primary mb-6">
                  Get in <span className="text-gradient-primary">Touch</span>
                </h1>
                <p className="text-text-secondary leading-relaxed mb-10">
                  Have a project in mind? Need automation help? Or just want to
                  say hi? Fill out the form below and I&apos;ll get back to you.
                </p>

                <div className="space-y-5">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-center gap-4 group">
                      <div className="w-11 h-11 shrink-0 rounded-xl glass gradient-border flex items-center justify-center text-accent-electric transition-colors group-hover:text-accent-blue">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-text-muted mb-0.5">
                          {info.title}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm text-text-primary hover:text-accent-blue transition-colors truncate block"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-text-primary truncate">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* WhatsApp — a dedicated card so its link opens in a new tab
                      without altering the shared email/location card logic. */}
                  <div className="flex items-center gap-4 group">
                    <div className="w-11 h-11 shrink-0 rounded-xl glass gradient-border flex items-center justify-center text-accent-electric transition-colors group-hover:text-accent-blue">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-text-muted mb-0.5">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/923239163815?text=Hi%20Nizam%2C%20I%27d%20like%20to%20discuss%20a%20project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-primary hover:text-accent-blue transition-colors truncate block"
                      >
                        +923239163815
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-10 pt-6 border-t border-white/10">
                <p className="text-xs text-text-muted">
                  Typically replies within 24–48 hours.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right glass form panel */}
          <Reveal direction="left" delay={0.1} className="lg:col-span-3">
            <div className="glass-strong rounded-3xl p-6 sm:p-9 h-full">
              {/* Animated status banners */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={reduceMotion ? false : { opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-6 p-4 bg-success/10 border border-success/25 rounded-xl flex items-center gap-3"
                      role="status"
                    >
                      <FormSuccessSparkle />
                      <p className="text-sm text-success">
                        Message sent successfully! I&apos;ll get back to you soon.
                      </p>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={reduceMotion ? false : { opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-6 p-4 bg-error/10 border border-error/25 rounded-xl flex items-center gap-3"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-error shrink-0" />
                      <p className="text-sm text-error">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-text-primary mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={cn(inputClass, "pl-11 pr-4 py-3")}
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(inputClass, "pl-11 pr-4 py-3")}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-inquiry" className="block text-sm font-medium text-text-primary mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="contact-inquiry"
                    value={formData.inquiryType}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiryType: e.target.value })
                    }
                    className={cn(inputClass, "px-4 py-3 appearance-none")}
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={cn(inputClass, "px-4 py-3")}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={cn(inputClass, "pl-11 pr-4 py-3 resize-none")}
                      placeholder="Tell me about your project or inquiry..."
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl shadow-[0_10px_36px_-14px_rgb(181_121_74_/_0.8)] hover:shadow-[0_14px_44px_-12px_rgb(133_92_255_/_0.8)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
