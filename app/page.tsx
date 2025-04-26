import Hero  from "@/components/landing/hero";
import { Logos } from "@/components/landing/Logos";
import Image from "next/image";

export default function Home() {
  return (
      <main className="">
        <Hero />
        <Logos />
      </main>
  );
}
