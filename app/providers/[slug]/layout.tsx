"use client";

import Link from "next/link";
import Image from "next/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import leftArrow from "@/public/leftArrow.svg";
import listOfServices from "@/data/services";

export default function ProvderListLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const paramsArray = params.slug.split("/");
  const serviceObject = listOfServices.find(({ href }) => {
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
        {paramsArray.map((slug) => (
          // added 1000 to key due to two items on route having same key
          <BreadcrumbItem href={`/${slug}`} key={slug + 1000}>
            {serviceObject?.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      {children}
    </section>
  );
}
