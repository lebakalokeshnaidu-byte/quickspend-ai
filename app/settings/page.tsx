import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { getPlatforms } from "@/lib/data";

export default async function SettingsPage() {
  const platforms = await getPlatforms();

  return (
    <div className="animate-fade-in mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your profile, platforms, and preferences." />
      <SettingsForm platforms={platforms} />
    </div>
  );
}
