import { Header } from "@/components/sections/header/index";
import { Footer } from "@/components/sections/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Your existing header */}
      <main className="flex-1">
        {children}
      </main>
      <Footer /> {/* Your existing footer */}
    </div>
  );
}