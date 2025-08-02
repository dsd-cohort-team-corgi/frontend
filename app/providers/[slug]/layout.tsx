"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import leftArrow from "@/public/leftArrow.svg";
import listOfServices from "@/data/services";
import { useBooking } from "@/components/context-wrappers/BookingContext";

export default function ProvderListLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const serviceObject =
    listOfServices[params.slug as keyof typeof listOfServices];
  const paramsArray = params.slug.split("/");
  const { resetBooking } = useBooking();
  // if the user has moved away from the individual providers page, delete all the booking context, so they start fresh when they click on another providers page
  useEffect(() => resetBooking(), []);

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
        {paramsArray.map((slug, index) => {
          const path = `/providers/${paramsArray.slice(0, index + 1).join("/")}`;
          // 0 => /providers/lawnandgarden
          // 1 => /providers/lawnandgarden/someproviderid
          return (
            <BreadcrumbItem key={slug + 1000}>
              <Link href={path} className="flex items-center">
                {serviceObject?.label}
              </Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
      {children}
    </section>
  );
}
