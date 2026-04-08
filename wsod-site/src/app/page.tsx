import Hero from "@/components/home/Hero";
import ServiceFolders from "@/components/home/ServiceFolders";
import BrandsSection from "@/components/home/BrandsSection";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <ServiceFolders />
      <BrandsSection />
      <HomeBlogSection />
      <Footer />
    </main>
  );
}