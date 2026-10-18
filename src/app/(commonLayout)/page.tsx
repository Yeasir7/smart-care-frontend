import { Hero } from "@/components/modules/Home/Hero";
import Specialities from "@/components/modules/Home/Specialties";
import Steps from "@/components/modules/Home/Steps";
import Testimonials from "@/components/modules/Home/Testimonials";
import TopRatedDoctors from "@/components/modules/Home/TopRatedDoctors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Healthcare - Find Your Perfect Doctor",
  description:
    "Discover top-rated doctors tailored to your needs with our AI-powered healthcare platform. Get personalized recommendations and book appointments effortlessly.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Specialities />
      <TopRatedDoctors />
      <Steps />
      <Testimonials />
    </main>
  );
}
