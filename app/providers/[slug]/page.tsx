"use client";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../../../public/leftArrow.svg";
import searchIcon from "../../../public/searchIcon.svg";
import star from "../../../public/star.svg";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
} from "@heroui/react";
import { lawnCareCompanies } from "@/data/mockProvidersList";
import services from "../../../data/services";
import { useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const [searchValue, setSearchValue] = useState<string>("Search Everything");

  //   returns an object from services array so we can have appropriate category header
  const categoryHeader = services.find(({ href }) => {
    const hrefWithNoSlash = href.split("/")[1];
    return hrefWithNoSlash === params.slug;
  });

  const chipServicesSet = new Set();
  const addServicesToChipServicesSet = () => {
    lawnCareCompanies.forEach(({ services }) => {
      services.forEach((service) => {
        chipServicesSet.add(service);
      });
    });
  };
  addServicesToChipServicesSet();
  const chipServicesArray = Array.from(chipServicesSet) as string[];

  return (
    <>
      <main>
        <h1 className="font-black">
          {categoryHeader?.label ? categoryHeader.label : "Service Not Found"}
        </h1>
        {/* Chip container */}
        <div className="flex">
          {chipServicesArray.map((service, idx) => (
            <Chip key={idx}>{service}</Chip>
          ))}
        </div>
        <Input
          type="search"
          value={searchValue}
          endContent={
            <Image src={searchIcon} alt="Search Icon" height={25} width={25} />
          }
          className="max-w-5xl rounded-xl border-1 border-secondary-font-color"
        />
        <p>{lawnCareCompanies.length} Providers Available</p>
        {lawnCareCompanies.map(
          ({ id, companyName, rating, numberOfReviews, services }) => (
            <Card
              key={id}
              className="mb-4 max-w-5xl border-1 border-secondary-font-color"
            >
              <CardHeader>{companyName}</CardHeader>
              <CardBody className="flex flex-row items-center gap-1">
                <Image src={star} alt="star icon" width={22} height={22} />
                <span className="font-black">{rating}</span>
                <span className="text-secondary-font-color">
                  ({numberOfReviews} reviews)
                </span>
              </CardBody>
              <CardFooter>
                {services.map((service, idx) => (
                  <Chip key={idx}>{service}</Chip>
                ))}
              </CardFooter>
            </Card>
          ),
        )}
      </main>
    </>
  );
}
