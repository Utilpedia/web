import { Header } from "@/components/layout/Header";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="content-container py-4">{children}</div>
    </div>
  );
}
