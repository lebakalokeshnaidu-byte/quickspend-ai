import { PageHeader } from "@/components/layout/PageHeader";
import { ImportWizard } from "@/components/import/ImportWizard";
import { getImportJobs, getPlatforms } from "@/lib/data";

export default async function ImportPage() {
  const [platforms, jobs] = await Promise.all([getPlatforms(), getImportJobs()]);

  return (
    <div className="animate-fade-in mx-auto max-w-3xl">
      <PageHeader
        title="Import"
        subtitle="Upload a screenshot or PDF invoice — we'll extract and classify the items."
      />
      <ImportWizard platforms={platforms} recentJobs={jobs} />
    </div>
  );
}
