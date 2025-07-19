import Image from "next/image";
import Link from "next/link";
import Card from "@/components/CardWithImage";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";
import listOfServices from "@/data/services";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center">
        {/* Container placed around image and text to allow for positioning based off image rather than screen */}
        <div className="relative">
          <Image
            className="h-[40dvh] rounded-lg object-cover md:h-[60dvh]"
            alt="Young woman diligently cleaning a bright, modern home."
            // static import to have Next Image component decide height and width to prevent CLS
            src={HomePageHeroImage}
          />
          {/* Text Container */}
          <div className="absolute left-[10%] top-[5%] w-1/2 md:top-[10%] lg:left-[15%] lg:top-[25%]">
            <div className="xlg:text-8xl text-3xl font-black md:text-7xl">
              <p>Book. Relax.</p>
              <p>Done.</p>
            </div>
            <p className="my-[10px] font-medium md:my-[1em] md:text-lg md:font-semibold">
              Professional services for your busy life.
            </p>
            <StyledAsButton
              as={Link}
              href="/"
              label="Start Your Search"
              className="text-xs md:text-base"
            />
          </div>
        </div>
      </div>

      <section className="mx-auto mt-20 max-w-[1200px] px-5 text-center sm:text-left">
        <h3 className="text-4xl font-bold text-primary-font-color">
          What service do you need?
        </h3>
        <p className="mb-8 mt-4 text-lg tracking-wider text-secondary-font-color">
          Choose from our most popular home services
        </p>
        <section className="grid-row-1 sm:grid-row-2 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
          {Object.values(listOfServices).map((service) => (
            <Card
              key={service.label}
              service={service}
              className="group relative shadow-none"
              // group relative allows for the blue hover effect, it will trigger the group div inside this component to activate
              // heroui has a shadow by default, turned off with shadow-none
            />
          ))}
        </section>
      </section>
    </div>
  );
}
