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
// importing mock providers as module object
import * as allMockProviders from "@/data/mockProvidersList";
import services from "@/data/services";
import { useEffect, useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Page({ params }: { params: { slug: string } }) {
  const [searchValue, setSearchValue] = useState<string>("Search Everything");
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [chipServicesArray, setChipServicesArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //returns an object from services array so we can have appropriate category header
  const serviceObject = services.find(({ href }) => {
    const hrefWithNoSlash = href.split("/")[1];
    return hrefWithNoSlash === params.slug;
  });

  // Dynamic import of service providers for each category on home screen, simulating a 1 second network call
  const importCompanyList = (slug: string): Promise<any[] | null> => {
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
  const addServicesToChipServicesSet = (companyList: any[]) => {
    const tempChipServicesSet = new Set<string>();
    companyList.forEach((company) => {
      company.services.forEach((service: string) => {
        tempChipServicesSet.add(service);
      });
    });
    setChipServicesArray(Array.from(tempChipServicesSet));
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (serviceObject?.companyList) {
        const importedList = await importCompanyList(params.slug);
        if (importedList) {
          setCompanyData(importedList);
          addServicesToChipServicesSet(importedList);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params.slug, serviceObject?.companyList]);

  return (
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <main>
          <h1 className="my-4 text-3xl font-black md:text-4xl lg:text-5xl">
            {serviceObject?.label ? serviceObject.label : "Service Not Found"}
          </h1>
          {/* Chip container */}
          {/* Conditionally render if there is a serice object */}
          {serviceObject?.label && (
            <div className="mb-4 flex gap-1 overflow-x-scroll">
              <Chip className="lg:text-lg">All</Chip>
              {chipServicesArray.map((service, idx) => (
                <Chip className="lg:text-lg" key={idx}>
                  {service}
                </Chip>
              ))}
            </div>
          )}
          <Input
            type="search"
            value={searchValue}
            endContent={
              <Image
                src={searchIcon}
                alt="Search Icon"
                height={25}
                width={25}
              />
            }
            className="mx-auto my-4 max-w-5xl rounded-xl border-1 border-secondary-font-color"
          />
          <p className="mb-4">{companyData.length} Providers Available</p>
          {companyData.map(
            ({ id, companyName, rating, numberOfReviews, services }) => (
              <Card
                classNames={{ header: "pb-1", body: "py-0" }}
                key={id}
                className="mx-auto mb-4 max-w-5xl border-1 border-secondary-font-color"
              >
                {/* Temp links back to same page until we decide routing for unique providers*/}
                <Link href={`/providers/${params.slug}`}>
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
                    {services.map((service: string, idx: number) => (
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
      )}
    </>
  );
}
