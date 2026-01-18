import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import Header from "../_components/Header";
import Hero from "../_components/Hero";
import { UserType } from "@/types";
import { redirect } from "next/navigation";
import Footer from "../_components/Footer";
import Hero2 from "../_components/ShowCase";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import ShowCase from "../_components/ShowCase";

export default async function Home() {
  const user = (await getCurrentDbUser()) as UserType;

  return (
    <div className="lock-scroll">
      <Header user={user} />
      <Hero />
      <ShowCase />
      <Footer />
    </div>
  );
}
