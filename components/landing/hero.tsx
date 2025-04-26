"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FloatingPaths } from "@/components/ui/floating-paths";
import { Send as Paperplane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const phoneSchema = z.string().regex(/^\d{9}$/, "Le numéro doit contenir 9 chiffres");

const Hero = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("237");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ne garder que les chiffres
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Valider le numéro de téléphone
      phoneSchema.parse(phoneNumber);
      
      const fullPhoneNumber = `+${countryCode}${phoneNumber}`;
      router.push(`/payment?phone=${encodeURIComponent(fullPhoneNumber)}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Veuillez saisir un numéro de téléphone valide (9 chiffres)");
      } else {
        toast.error("Une erreur s'est produite");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="dark min-h-screen relative border-b border-muted bg-background pt-10 px-4 lg:px-16">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <a href="payment"className="absolute z-10 top-4 right-4 lg:right-8 py-2 px-4 rounded text-primary bg-black">Pay Now</a>
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-2 md:gap-4 lg:grid-cols-2">
          <div className="flex w-full max-w-[31.25rem] flex-col gap-9 lg:max-w-[37.5rem] lg:py-[20%] xl:py-[26%]">
            <p className="font-mono text-[clamp(0.875rem,_0.875vw,_1rem)] text-muted-foreground">
              Best Platform 2025 - By Ejara Magazine
            </p>
            <h1 className="font-bebas_neue text-7xl leading-[0.95] tracking-[-0.03em] text-foreground">
              Use Your Money, <span className="italic text-primary">Everywhere.</span>
            </h1>
            <p className="text-[clamp(1.125rem,_1.125vw,_1.4rem)] leading-normal text-muted-foreground">
              Unlock the unlimited potential of your finances using the power of
              Bitcoin at the speed of light. Powered by the Lightning Network, we turn crypto into real-world cash in seconds.
              <br />
              <span className="text-primary">Everywhere. Anytime</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-shrink-0">
                <label htmlFor="country-code" className="block text-sm font-medium text-muted-foreground mb-2">
                  Pays
                </label>
                <select 
                  id="country-code"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="237">Cameroon (+237)</option>
                  <option value="235">Tchad (+235)</option>
                </select>
              </div>
              
              <div className="flex-grow">

                <div className="flex gap-2">
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="Entrez votre numéro"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={9}
                    className="flex-grow"
                    required
                    pattern="[0-9]*"
                  />
                  <Button 
                    type="submit" 
                    className="flex-shrink-0 px-6"
                    disabled={isSubmitting || phoneNumber.length !== 9}
                  >
                    {isSubmitting ? (
                      "Envoi..."
                    ) : (
                      <>
                        Envoyer <Paperplane className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div>
            <div className="relative ml-8 aspect-square w-full max-w-[56.25rem] overflow-hidden lg:absolute lg:right-0 lg:bottom-0 lg:w-1/2">
              <div className="absolute right-0 bottom-0 w-[85%] overflow-hidden rounded-lg">
                <AspectRatio ratio={0.918918919 / 1}>
                  <img
                    src="/woman.png"
                    alt=""
                    className="block size-full object-cover object-left-top"
                  />
                </AspectRatio>
              </div>
              <div className="absolute right-[5%] bottom-0 w-[40%] overflow-hidden rounded-tl-lg rounded-tr-lg shadow-md">
                <AspectRatio ratio={0.776119403 / 1}>
                  <img
                    src="/bg.png"
                    alt=""
                    className="block h-full w-full object-cover object-top"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
