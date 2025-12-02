import { VersionsSection } from "./versions-section";

type Props = {};

function Page({}: Props) {
  return (
    <main className="min-h-screen">
      <div className="space-y-6">
        {/* TODO set something */}
        <VersionsSection />
      </div>
    </main>
  );
}

export default Page;
