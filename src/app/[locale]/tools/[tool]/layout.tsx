import { Sidebar } from "@/components/layout/Sidebar";

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      {/* Sidebar - hidden on mobile/tablet, shown on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
