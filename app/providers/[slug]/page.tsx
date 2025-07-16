"use client";
import Link from "next/link";
import Image from "next/image";
import searchIcon from "../../../public/searchIcon.svg";
import star from "../../../public/star.svg";
import {
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

  //Declares a set to easily allow non repeating values
  const chipServicesSet = new Set();
  //gathers all services from the companies and pushes them into the set
  const addServicesToChipServicesSet = () => {
    lawnCareCompanies.forEach(({ services }) => {
      services.forEach((service) => {
        chipServicesSet.add(service);
      });
    });
  };
  addServicesToChipServicesSet();
  //Creates a new array from the values in the set to map over in JSX
  const chipServicesArray = Array.from(chipServicesSet) as string[];

  return (
    <>
      <main>
        <h1 className="my-4 text-3xl font-black md:text-4xl lg:text-5xl">
          {categoryHeader?.label ? categoryHeader.label : "Service Not Found"}
        </h1>
        {/* Chip container */}
        <div className="mb-4 flex gap-1 overflow-x-scroll">
          <Chip className="lg:text-lg">All</Chip>
          {chipServicesArray.map((service, idx) => (
            <Chip className="lg:text-lg" key={idx}>
              {service}
            </Chip>
          ))}
        </div>
        <Input
          type="search"
          value={searchValue}
          endContent={
            <Image src={searchIcon} alt="Search Icon" height={25} width={25} />
          }
          className="mx-auto my-4 max-w-5xl rounded-xl border-1 border-secondary-font-color"
        />
        <p className="mb-4">{lawnCareCompanies.length} Providers Available</p>
        {lawnCareCompanies.map(
          ({ id, companyName, rating, numberOfReviews, services }) => (
            <Card
              classNames={{ header: "pb-1", body: "py-0" }}
              key={id}
              className="mx-auto mb-4 max-w-5xl border-1 border-secondary-font-color"
            >
              {/* Temp links back to same page until we decide routing for unique providers*/}
              <Link href={`/providers/${params.slug}`}>
                <CardHeader className="text-xl lg:text-3xl">{companyName}</CardHeader>
                <CardBody className="flex flex-row items-center gap-1">
                  <Image src={star} alt="star icon" width={22} height={22} />
                  <span className="lg:text-xl font-black">{rating}</span>
                  <span className="lg:text-xl text-secondary-font-color">
                    ({numberOfReviews} reviews)
                  </span>
                </CardBody>
                <CardFooter className="flex gap-1 overflow-x-scroll">
                  {services.map((service, idx) => (
                    <Chip key={idx} className="lg:text-lg">
                      {service}
                    </Chip>
                  ))}
                </CardFooter>
              </Link>
            </Card>
          ),
        )}
      </main>
    </>
  );
}
