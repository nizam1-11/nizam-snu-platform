import { getDb } from "@/lib/db";
import { adminUsers, profile, settings } from "@/lib/db/schema";
import { hash } from "bcryptjs";
import crypto from "crypto";

async function seed() {
  const db = getDb();
  const now = new Date().toISOString();

  // Create admin user
  const adminId = crypto.randomUUID();
  const passwordHash = await hash("changeme123", 12);

  await db.insert(adminUsers).values({
    id: adminId,
    email: "nizam14010@gmail.com",
    passwordHash,
    name: "Syed Nizam Uddin",
    role: "admin",
    mfaEnabled: false,
    createdAt: now,
    updatedAt: now,
  });

  console.log("✅ Admin user created:");
  console.log("   Email: nizam14010@gmail.com");
  console.log("   Password: changeme123 (CHANGE THIS!)");
  console.log("   ID:", adminId);

  // Create profile
  await db.insert(profile).values({
    id: 1,
    name: "Syed Nizam Uddin",
    tagline: "AI Automation Developer & App Creator",
    bio: "I build AI-powered applications, business automation systems, and software products under the SNU Automation brand.",
    location: "Pakistan",
    email: "nizam14010@gmail.com",
    githubUrl: "https://github.com/yourusername",
    linkedinUrl: "https://linkedin.com/in/yourusername",
    twitterUrl: "https://twitter.com/yourusername",
    updatedAt: now,
  });

  console.log("✅ Profile created");

  // Create default settings
  const defaultSettings = [
    { key: "site_name", value: JSON.stringify("Nizam — SNU Automation") },
    { key: "site_description", value: JSON.stringify("AI Automation Developer & Software Creator") },
    { key: "site_url", value: JSON.stringify("https://nizam-snu.pages.dev") },
    { key: "contact_email", value: JSON.stringify("nizam14010@gmail.com") },
    { key: "analytics_enabled", value: JSON.stringify(true) },
  ];

  for (const setting of defaultSettings) {
    await db.insert(settings).values({
      key: setting.key,
      value: setting.value,
      updatedAt: now,
    });
  }

  console.log("✅ Default settings created");
  console.log("\n🎉 Seed complete! Change the admin password immediately.");
}

seed().catch(console.error);