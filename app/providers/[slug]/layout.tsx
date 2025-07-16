'use client'
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../../../public/leftArrow.svg";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
export default function ProvderListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-[90%] max-w-5xl mx-auto">
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/" className="flex items-center">
            <Image
              src={leftArrow}
              alt="navigate to previous page"
              width={17}
              height={17}
              className="inline"
            />
            Back to home
          </Link>
        </BreadcrumbItem>
      </Breadcrumbs>
      {children}
    </section>
  );
}
