import Image from "next/image";
import Link from "next/link";
import HomePageHeroImage from "../public/HomePageHeroImage.png";
import StyledAsButton from "@/components/StyledAsButton";

export default function Home() {
  return (
    <div>
      <div className="relative m-auto w-4/5">
        <Image
          className="h-[40dvh] rounded-lg object-cover md:h-[60dvh]"
          alt="Young woman diligently cleaning a bright, modern home."
          // static import to have Next Image component decide height and width to prevent CLS
          src={HomePageHeroImage}
        />
        {/* Text Container */}
        <div className="absolute left-[10%] top-[5%] w-1/2 md:top-[10%]">
          <div className="text-3xl font-black md:text-7xl">
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
  );
}
