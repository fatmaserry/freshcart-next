import { AccountNav } from "@/components/account/AccountNav";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="My Account"
        subtitle="Manage your addresses and account settings"
        crumbs={[{ label: "My Account" }]}
        icon={{ name: "user", filled: true }}
        compact
        padding="py-10 sm:py-12"
      />
      <div className="container-page flex flex-col gap-8 py-8 lg:flex-row">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
