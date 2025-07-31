"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
} from "@heroui/react";
// importing mock providers as module object
import listOfServices from "@/data/services";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import searchIcon from "../../../public/searchIcon.svg";
import star from "../../../public/star.svg";
import { useApiQuery } from "@/lib/api-client";

interface CompanyListInterface {
  id: string;
  company_name: string;
  rating: number;
  numberOfReviews: number;
  services: {
    id: string;
    service_title: string;
    service_description: string;
    pricing: number;
    duration: number;
    category: string;
  }[];
}

export default function Page({ params }: { params: { slug: string } }) {
  const [searchValue, setSearchValue] = useState<string>("Search Everything");
  // making a copy so we always have the original data to if user ever removes filters
  const [companyData, setCompanyData] = useState<CompanyListInterface[]>([]);
  const [filteredCompanyData, setFilteredCompanyData] =
    useState<CompanyListInterface[]>();
  const [chipServicesArray, setChipServicesArray] = useState<string[]>(["All"]);
  const [activeChip, setActiveChip] = useState<number>(0);
  const { data, error, isLoading } = useApiQuery<CompanyListInterface[]>(
    ["providers", "all", "category"],
    `/providers/all/${params.slug}`,
  );

  const serviceObject =
    listOfServices[params.slug as keyof typeof listOfServices];

  // Gathers all services from the companies and pushes them into the set and back to array for easy non repeating values
  const addServicesToChipServicesSet = (
    companyList: CompanyListInterface[],
  ) => {
    const tempChipServicesSet = new Set<string>();
    companyList.forEach((company) => {
      company.services.forEach((service) => {
        tempChipServicesSet.add(service.service_title);
      });
    });
    setChipServicesArray(["All", ...Array.from(tempChipServicesSet)]);
  };

  useEffect(() => {
    setCompanyData(data ?? []);
    setFilteredCompanyData(data ?? []);
    addServicesToChipServicesSet(data ?? []);
  }, [params.slug, data]);

  const handleChipFilter = (serviceTitle: string) => {
    if (serviceTitle === "All") {
      setFilteredCompanyData(companyData);
      return;
    }
    const filteredCompanies = companyData.filter(({ services }) => {
      return services.some((service) => service.service_title === serviceTitle);
    });
    setFilteredCompanyData(filteredCompanies);
  };

  const handleSearchBarFilter = (input: string) => {
    // ensures all companies are shown on page if input is cleared
    if (input === "") {
      setFilteredCompanyData(companyData);
      return;
    }
    const lowerCasedInput = input.toLocaleLowerCase();
    const filteredCompanies = companyData.filter(
      ({ company_name, services }) => {
        if (!company_name) {
          return false;
        }
        // Gets company names from filter
        const nameMatches = company_name
          .toLowerCase()
          .includes(lowerCasedInput);

        // Gets services from company from filter
        const servicesMatch = services.some((service) => {
          return service.service_title.toLowerCase().includes(lowerCasedInput);
        });

        return nameMatches || servicesMatch;
      },
    );
    setFilteredCompanyData(filteredCompanies);
  };

  if (isLoading) {
    return (
      <>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return <h1>Something went wrong {error.message}</h1>;
  }

  return (
    <main>
      <h1 className="my-4 text-3xl font-black md:text-4xl lg:text-5xl">
        {serviceObject?.label ? serviceObject.label : "Service Not Found"}
      </h1>
      {/* Chip container */}
      {/* Conditionally render if there is a serice object */}
      {serviceObject?.label && (
        <div className="mb-4 flex gap-1 overflow-x-scroll">
          {chipServicesArray.map((service, idx) => (
            <Chip
              onClick={() => {
                setActiveChip(idx);
                handleChipFilter(service);
              }}
              classNames={{ base: "bg-transparent" }}
              className={
                activeChip === idx
                  ? "bg-gray-500 text-white hover:cursor-pointer lg:text-lg"
                  : "hover:cursor-pointer lg:text-lg"
              }
              /* eslint-disable react/no-array-index-key */
              key={`chip-${service}-${idx}`}
            >
              {service}
            </Chip>
          ))}
        </div>
      )}
      <Input
        type="search"
        onClick={() => setSearchValue("")}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearchBarFilter(e.target.value);
        }}
        value={searchValue}
        endContent={
          <Image src={searchIcon} alt="Search Icon" height={25} width={25} />
        }
        className="mx-auto my-4 max-w-5xl rounded-xl border-1 border-secondary-font-color"
      />
      <p className="mb-4">
        {filteredCompanyData?.length ?? 0} Providers Available
      </p>
      {filteredCompanyData &&
        filteredCompanyData.map(
          ({ id, company_name, rating, numberOfReviews, services }) => (
            <Card
              classNames={{ header: "pb-1", body: "py-0" }}
              key={id}
              className="mx-auto mb-4 max-w-5xl border-1 border-secondary-font-color"
            >
              {/* Temp links back to same page until we decide routing for unique providers */}
              <Link href={`/providers/${params.slug}/${id}`}>
                <CardHeader className="text-xl lg:text-3xl">
                  {company_name || "Company Name Not Found"}
                </CardHeader>
                <CardBody className="flex flex-row items-center gap-1">
                  <Image src={star} alt="star icon" width={22} height={22} />
                  <span className="font-black lg:text-xl">{rating}</span>
                  <span className="text-secondary-font-color lg:text-xl">
                    {numberOfReviews ? (
                      <>({numberOfReviews} reviews)</>
                    ) : (
                      "Be the first to review!"
                    )}
                  </span>
                </CardBody>
                <CardFooter className="flex gap-1 overflow-x-scroll">
                  {services.map((service) => (
                    <Chip
                      key={`${company_name}cardChip-${service.service_title}-${service.id}`}
                      className="lg:text-lg"
                    >
                      {service.service_title}
                    </Chip>
                  ))}
                </CardFooter>
              </Link>
            </Card>
          ),
        )}
    </main>
  );
}
