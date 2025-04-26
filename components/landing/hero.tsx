import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FloatingPaths } from "@/components/ui/floating-paths";
import { Send as Paperplane } from "lucide-react";
import {Input} from "@/components/ui/input";

const Hero = () => {
  return (
    <section className="dark relative border-b border-muted bg-background pt-10 px-4 lg:px-16">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-2 md:gap-4 lg:grid-cols-2">
          <div className="flex w-full max-w-[31.25rem] flex-col gap-9 lg:max-w-[37.5rem] lg:py-[20%] xl:py-[26%]">
            <p className="font-mono text-[clamp(0.875rem,_0.875vw,_1rem)] text-muted-foreground">
              Best Platform 2025  - By Ejara Magazine
            </p>
            <h1 className="font-bebas_neue text-7xl leading-[0.95] tracking-[-0.03em] text-foreground">
              Use Your Money,     <span className="italic text-primary">Everywhere.</span>
            </h1>
            <p className="text-[clamp(1.125rem,_1.125vw,_1.4rem)] leading-normal text-muted-foreground">
              Unlock the unlimited potential of your finances using the power of
              Bitcoin at the speed of light. Powered by the Lightning Network, we turn crypto into real-world cash in seconds.
              <br />
              <span className="text-primary">Everywhere. Anytime</span>
            </p>

            {/* Number input and button send  */}
            <div className="flex align-center gap-4 ">
              {/* On selectionne l'incatif du pays */}
              <select className="border border-muted bg-background px-4 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <option value="237">Cameroon (+237)</option>
                <option value="235">Tchad (+235)</option>
              </select>
              <div className="flex w-full max-w-[31.25rem] flex-col gap-4 lg:max-w-[37.5rem]">
                <Input
                  type="text"
                  placeholder="Enter your phone number"
                  className="rounded-md border w-[20em] py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <button className="flex items-center gap-2 justify-center px-4 bg-primary text-background transition-all duration-200 ease-in-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Envoyer<Paperplane className="h-4 w-4 text-background" />
              </button>
              
            </div>
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
