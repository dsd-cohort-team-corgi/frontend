"use client";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../../../public/leftArrow.svg";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import services from "@/data/services";
export default function ProvderListLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const paramsArray = params.slug.split("/");
  const serviceObject = services.find(({ href }) => {
    const hrefWithNoSlash = href.split("/")[1];
    return hrefWithNoSlash === params.slug;
  });
  return (
    <section className="mx-auto w-[90%] max-w-5xl">
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
        {paramsArray.map((slug, idx) => (
          // added 1000 to key due to two items on route having same key
          <BreadcrumbItem href={`/${slug}`} key={idx + 1000}>
            {serviceObject?.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      {children}
    </section>
  );
}
