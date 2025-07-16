"use client";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../../../public/leftArrow.svg";
import searchIcon from "../../../public/searchIcon.svg";
import { BreadcrumbItem, Breadcrumbs, Input } from "@heroui/react";
import { lawnCareCompanies } from "@/data/mockProvidersList";
import services from "../../../data/services";
import { useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const [searchValue, setSearchValue] = useState<string>("Search Everything");

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
        {/* Chips for sub services */}
        <Input
          type="search"
          value={searchValue}
          endContent={
            <Image src={searchIcon} alt="Search Icon" height={25} width={25} />
          }
          className="border-secondary-font-color mx-auto w-4/5 max-w-5xl rounded-xl border-1"
        />
      </main>
    </>
  );
}
