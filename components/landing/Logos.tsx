const Logos = () => {
    const partners = [
      {
        name: "Astro",
        logo: "/ejara.png",
      },
      {
        name: "Vercel",
        logo: "/cba-long.png",
      },
      {
        name: "Astro",
        logo: "/my-coolpay.png",
      },
      {
        name: "Supabase",
        logo: "/weltrade.png",
      },
    ];
  
    return (
      <section className="flex flex-wrap items-center justify-between gap-12 px-4 py-2 lg:px-16">
        <p className="text-lg  tracking-[-0.32px] text-primary">
          Powered By The Best Partners.
        </p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 opacity-70 grayscale hover:grayscale-0 lg:gap-[60px]">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={109}
              height={48}
              className="object-contain grayscale hover:grayscale-0"
            />
          ))}
        </div>
      </section>
    );
  };
  
  export { Logos };
  