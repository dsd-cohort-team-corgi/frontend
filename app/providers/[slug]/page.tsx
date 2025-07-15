"use client";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../../../public/leftArrow.svg";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { lawnCareCompanies } from "@/data/mockProvidersList";
import services from "../../../data/services";

export default function Page({ params }: { params: { slug: string } }) {
  //   returns an object from services array so we can have appropriate category header
  const service = services.find(({ href }) => {
    const hrefWithNoSlash = href.split("/")[1];
    return hrefWithNoSlash === params.slug;
  });

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/" className="flex items-center">
            <Image
              src={leftArrow}
              alt="navigate to previous page"
              width={25}
              height={25}
              className="inline"
            />
            Back to home
          </Link>
        </BreadcrumbItem>
      </Breadcrumbs>
      <main>
        <h1>{service?.label ? service.label : "Service Not Found"}</h1>
        <input
          type="search"
          name=""
          id=""
          placeholder="Search"
          className="border-1 border-black"
        />
      </main>
    </>
  );
}
