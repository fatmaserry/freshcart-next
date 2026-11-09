import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <section className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-heading">Account Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Update your profile information and change your password
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm">
        <div className="p-8">
          <ProfileForm />
        </div>
        <div className="border-t border-line-soft bg-surface-alt/50 p-8">
          <ChangePasswordForm />
        </div>
      </div>
    </section>
  );
}
