import Hero  from "@/components/landing/hero";
import { Logos } from "@/components/landing/Logos";
import Image from "next/image";

function page() {
  return (
      <main className="">
        <Hero />
        <Logos />
      </main>
  );
}

export default page