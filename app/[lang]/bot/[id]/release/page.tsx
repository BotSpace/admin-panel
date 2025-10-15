import { StagingSection } from "./staging-section";
import { VersionsSection } from "./versions-section";

type Props = {};

function Page({}: Props) {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* <StagingSection /> */}
        {/* TODO set something */}
        <VersionsSection />
      </div>
    </main>
  );
}

export default Page;
