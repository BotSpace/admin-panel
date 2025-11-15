"use client";

import { ProfileInfoSection } from "@/features/auth/components/profile-info-section";
import { PasswordSection } from "@/features/auth/components/password-section";
import { LanguageSection } from "@/features/auth/components/language-section";
import { NotificationSection } from "@/features/auth/components/notification-section";
import { AppearanceSection } from "@/features/auth/components/appearance-section";
import { DangerSection } from "@/features/auth/components/danger-section";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground mt-2">
            Shaxsiy ma'lumotlaringizni boshqaring va sozlamalarni o'zgartiring
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Info */}
            <ProfileInfoSection />

            {/* Password Section */}
            <PasswordSection />

            {/* Language Section */}
            <LanguageSection />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notification Settings */}
            <NotificationSection />

            {/* Appearance Settings */}
            <AppearanceSection />

            {/* Danger Zone */}
            <DangerSection />
          </div>
        </div>
      </div>
    </main>
  );
}
