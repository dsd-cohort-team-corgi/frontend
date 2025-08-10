"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import leftArrow from "@/public/leftArrow.svg";
import listOfServices from "@/data/services";
import { useBooking } from "@/components/context-wrappers/BookingContext";

export default function ProviderListLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const paramsArray = params.slug.split("/");
  const { resetBooking } = useBooking();

  // if the user has moved away from the individual providers page, delete all the booking context, so they start fresh when they click on another providers page
  useEffect(() => resetBooking(), [resetBooking]);

  // Get the service name from the first part of the slug
  const serviceSlug = paramsArray[0];
  const serviceName =
    listOfServices[serviceSlug as keyof typeof listOfServices]?.label ||
    serviceSlug;

  return (
    <section className="mx-auto w-[90%] max-w-5xl">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Image
              src={leftArrow}
              alt="navigate to previous page"
              width={17}
              height={17}
              className="inline"
            />
            Home
          </Link>
        </BreadcrumbItem>

        {/* Service category breadcrumb */}
        <BreadcrumbItem>
          <Link
            href={`/providers/${serviceSlug}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {serviceName}
          </Link>
        </BreadcrumbItem>

        {/* Provider detail breadcrumb (only show if we're on a provider page) */}
        {paramsArray.length > 1 && (
          <BreadcrumbItem>
            <span className="text-gray-900 font-medium">Provider Details</span>
          </BreadcrumbItem>
        )}
      </Breadcrumbs>
      {children}
    </section>
  );
}
