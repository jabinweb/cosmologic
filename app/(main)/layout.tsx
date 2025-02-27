import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <>
        <Header />
        {children}
        <Footer />
    </>
  );
}