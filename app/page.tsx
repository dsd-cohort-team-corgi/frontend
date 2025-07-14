import Image from "next/image";
import Link from "next/link";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";

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
    </div>
  );
}
