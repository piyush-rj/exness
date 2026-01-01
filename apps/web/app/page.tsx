import Footer from "@/src/components/base/Footer";
import Hero from "@/src/components/base/Hero";
import Navbar from "@/src/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="bg-[#050505] text-neutral-200">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
