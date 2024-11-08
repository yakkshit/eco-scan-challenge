import { HeroSection } from "@/components/sections/herosection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-grow">
        <HeroSection />
      </section>
    </div>
  );
}
