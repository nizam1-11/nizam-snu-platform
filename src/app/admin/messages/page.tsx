"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Mail,
  Search,
  Reply,
  Archive,
  Trash2,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fallbackMessages = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    subject: "AI Automation Inquiry",
    message: "I'm interested in automating my business processes. Can you help?",
    inquiryType: "service",
    status: "unread",
    createdAt: "2026-11-16T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Download Issue",
    message: "I'm having trouble installing the AI Task Automator on Windows 11.",
    inquiryType: "support",
    status: "read",
    createdAt: "2026-11-15T14:20:00Z",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    subject: "Project Collaboration",
    message: "Would you be interested in collaborating on an open-source project?",
    inquiryType: "project",
    status: "replied",
    createdAt: "2026-11-14T09:15:00Z",
  },
];

const statusColors: Record<string, string> = {
  unread: "bg-accent-blue/15 text-accent-blue border-accent-blue/25",
  read: "bg-text-secondary/15 text-text-secondary border-border",
  replied: "bg-success/15 text-success border-success/25",
  archived: "bg-warning/15 text-warning border-warning/25",
};

export default function AdminMessagesPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState(fallbackMessages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/messages", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.messages) || data.messages.length === 0) return;
        setMessages(
          data.messages.map((m: any) => ({
            id: String(m.id ?? ""),
            name: String(m.name ?? ""),
            email: String(m.email ?? ""),
            subject: String(m.subject ?? ""),
            message: String(m.message ?? ""),
            inquiryType: String(m.inquiryType ?? "general"),
            status: String(m.status ?? "unread"),
            createdAt: String(m.createdAt ?? ""),
          }))
        );
      })
      .catch(() => {
        // Keep fallback data on error.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm('Delete "' + label + '"? This cannot be undone.')) return;
    setDeleteError("");
    setDeletingId(id);
    try {
      const res = await fetch("/api/messages/" + id, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((x) => x.id !== id));
        setSelectedMessage((prev) => (prev === id ? null : prev));
      } else {
        setDeleteError("Could not delete. Please try again.");
      }
    } catch {
      setDeleteError("Could not delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selected = messages.find((m) => m.id === selectedMessage);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Messages
        </h1>
        <p className="text-sm text-text-secondary">
          Contact form submissions and inquiries.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            aria-label="Search messages"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-11 pr-9 py-2.5 bg-surface border border-border rounded-xl text-text-primary transition-all focus:outline-none focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20 sm:min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-error">{deleteError}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              <button
                onClick={() => setSelectedMessage(msg.id)}
                className={cn(
                  "w-full text-left glass rounded-xl p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue",
                  selectedMessage === msg.id
                    ? "ring-2 ring-accent-blue/70 border-accent-blue/40 shadow-[0_0_28px_-14px_rgb(181_121_74_/_0.9)]"
                    : "hover:bg-surface-elevated/50"
                )}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {msg.name}
                  </span>
                  <span className={cn("shrink-0 px-2 py-0.5 text-xs rounded-full border capitalize", statusColors[msg.status])}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">
                  {msg.subject}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </button>
            </motion.div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              No messages found.
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass gradient-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-heading font-bold text-text-primary">
                    {selected.subject}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    From: {selected.name} ({selected.email})
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(selected.createdAt).toLocaleString()} •{" "}
                    {selected.inquiryType}
                  </p>
                </div>
                <span className={cn("shrink-0 px-2.5 py-1 text-xs rounded-full border capitalize", statusColors[selected.status])}>
                  {selected.status}
                </span>
              </div>

              <div className="bg-surface-deep/60 border border-border rounded-xl p-4 mb-6">
                <p className="text-sm text-text-secondary whitespace-pre-line">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Reply className="w-4 h-4" />
                  Reply via Email
                </a>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Replied
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary glass rounded-xl hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-error glass rounded-xl hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error" onClick={() => handleDelete(selected.id, selected.subject || selected.id)} disabled={deletingId === selected.id}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-text-secondary">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
