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
import * as allMockProviders from "@/data/mockProvidersList";
import listOfServices from "@/data/services";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import searchIcon from "../../../public/searchIcon.svg";
import star from "../../../public/star.svg";

interface CompanyListInterface {
  id: string;
  companyName: string;
  rating: number;
  numberOfReviews: number;
  services: string[];
}

export default function Page({ params }: { params: { slug: string } }) {
  const [searchValue, setSearchValue] = useState<string>("Search Everything");
  // making a copy so we always have the original data to if user ever removes filters
  const [companyData, setCompanyData] = useState<CompanyListInterface[]>([]);
  const [filteredCompanyData, setFilteredCompanyData] =
    useState<CompanyListInterface[]>();
  const [chipServicesArray, setChipServicesArray] = useState<string[]>(["All"]);
  const [activeChip, setActiveChip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const serviceObject =
    listOfServices[params.slug as keyof typeof listOfServices];

  // Dynamic import of service providers for each category on home screen, simulating a 1 second network call
  const importCompanyList = (
    slug: string,
  ): Promise<CompanyListInterface[] | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let companyListName: keyof typeof allMockProviders;
        switch (slug) {
          case "lawnandgarden":
            companyListName = "lawnCareCompanies";
            break;
          case "assemblyandinstallation":
            companyListName = "assemblyInstallationCompanies";
            break;
          case "specializedcleaning":
            companyListName = "specializedCleaningCompanies";
            break;
          case "exteriorcleaning":
            companyListName = "exteriorCleaningCompanies";
            break;
          case "handymanandrepairs":
            companyListName = "handymanRepairCompanies";
            break;
          case "housecleaning":
            companyListName = "houseCleaningCompanies";
            break;
          default:
            resolve(null);
            return;
        }
        const selectedCompanyList = allMockProviders[companyListName];
        if (selectedCompanyList) {
          resolve(selectedCompanyList);
        } else {
          console.error(`Export ${companyListName} not found`);
          resolve(null);
        }
      }, 1000);
    });
  };

  // Gathers all services from the companies and pushes them into the set and back to array for easy non repeating values
  const addServicesToChipServicesSet = (
    companyList: CompanyListInterface[],
  ) => {
    const tempChipServicesSet = new Set<string>();
    companyList.forEach((company) => {
      company.services.forEach((service: string) => {
        tempChipServicesSet.add(service);
      });
    });
    setChipServicesArray((prev) => [
      ...prev,
      ...Array.from(tempChipServicesSet),
    ]);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (serviceObject?.companyList) {
        const importedList = await importCompanyList(params.slug);
        if (importedList) {
          setCompanyData(importedList);
          setFilteredCompanyData(importedList);
          addServicesToChipServicesSet(importedList);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params.slug, serviceObject?.companyList]);

  const handleChipFilter = (service: string) => {
    if (service === "All") {
      setFilteredCompanyData(companyData);
      return;
    }
    const filteredCompanies = companyData.filter(({ services }) => {
      return services.some((s: string) => s === service);
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
      ({ companyName, services }) => {
        // Gets company names from filter
        const nameMatches = companyName.toLowerCase().includes(lowerCasedInput);

        // Gets services from company from filter
        const servicesMatch = services.some((service: string) => {
          return service.toLowerCase().includes(lowerCasedInput);
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
          ({ id, companyName, rating, numberOfReviews, services }) => (
            <Card
              classNames={{ header: "pb-1", body: "py-0" }}
              key={`${companyName}-${id}`}
              className="mx-auto mb-4 max-w-5xl border-1 border-secondary-font-color"
            >
              {/* Temp links back to same page until we decide routing for unique providers */}
              <Link href={`/providers/${params.slug}/${id}`}>
                <CardHeader className="text-xl lg:text-3xl">
                  {companyName}
                </CardHeader>
                <CardBody className="flex flex-row items-center gap-1">
                  <Image src={star} alt="star icon" width={22} height={22} />
                  <span className="font-black lg:text-xl">{rating}</span>
                  <span className="text-secondary-font-color lg:text-xl">
                    ({numberOfReviews} reviews)
                  </span>
                </CardBody>
                <CardFooter className="flex gap-1 overflow-x-scroll">
                  {services.map((service: string) => (
                    <Chip
                      key={`${companyName}cardChip-${service}`}
                      className="lg:text-lg"
                    >
                      {service}
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
