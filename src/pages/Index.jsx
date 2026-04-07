import { Hero } from "@/components/home/Hero";
import { Specialties } from "@/components/home/Specialties";
import { TopDoctors } from "@/components/home/TopDoctors";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Banner } from "@/components/home/Banner";

const Index = () => {
  return (
    <>
      <Hero />
      <Specialties />
      <TopDoctors />
      <ServicesSection />
      <Banner />
    </>
  );
};

export default Index;
