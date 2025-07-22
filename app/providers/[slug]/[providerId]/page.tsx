"use client";

import React, { useState, useMemo } from "react";
import { Mail, Phone } from "lucide-react";
import { useDisclosure } from "@heroui/react";
import StarRatingReview from "@/components/ProviderOverallRatingInfo";
import IconServiceTime from "@/components/IconServiceTime";
import ReviewCard from "@/components/ReviewCard";
import StyledAsButton from "@/components/StyledAsButton";
import convertDateToTimeFromNow from "@/utils/convertDateToTimeFromNow";
import SignInModal from "@/components/SignInModal";
import Calendar from "@/components/Calendar/Calendar";

// https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#convention
// the docs are showing the Next.JS 15 behavior where params is a promise
// however for Next.js 14 it is synchronous prop

// type ProviderProps = {
//   category: string;
//   providerId: string;
// };
export default function Page() {
  // { params }: { params: ProviderProps }
  // const { slug, providerId } = params;
  // params must match dynamic folder names,providerid !== providerId

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >();

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();

  const providerInfo = {
    description: "this is the providers description from the database",
    name: "GreenThumb Pros",
    email: "provider@gmail.com",
    phone_number: "999-111-1111",
    appointments: [
      // UTC time string not PST
      { start_time: "2025-07-23T17:00:00Z", duration: 60 },
      { start_time: "2025-07-25T18:30:00Z", duration: 60 },
    ],
  };

  const serviceOptions = [
    { description: "Lawn Mowing", time: 60, price: 65, id: "453543" },
    { description: "Garden Maintence", time: 90, price: 85, id: "12343424" },
    { description: "Garden Maintence 2", time: 90, price: 85, id: "4435" },
    { description: "Garden Maintence 3", time: 90, price: 85, id: "45353" },
    { description: "Garden Maintence 4", time: 90, price: 85, id: "764564" },
  ];

  const fakeReviews = [
    {
      customer_id: 1267673,
      customer_name: "Sarah Johnson",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 5,
    },
    {
      customer_id: 1245351323,
      customer_name: "Evil Corgi",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 3,
    },
    {
      customer_id: 134243231323,
      customer_name: "Chaotic Neutral Corgi",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 4,
    },
    {
      customer_id: 12453453,
      customer_name: "Sir Barksworth II",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 1,
    },
  ];

  // we need customer reviews to move up on large screens to fill the leftover space when there are 2 or more services
  // how can we do this? with a classMap so tailwindcss understands what we want to do:

  // Tailwind CSS purges unused styles based on the class names it finds in source files during build time
  // So dynamically generating class names like `xl:-mt-[${offset}px]` won't work because Tailwind never "sees" those strings, because its created after
  //  a classMap has all the string literals created already, so tailwindcss can see they exist
  // This way, Tailwind includes the corresponding styles in the final CSS bundle, ensuring your dynamic logic works at runtime.

  // why won't style={{}} work? because we need this to only apply on xl screens, which would require a media query to work, which would result in a flash of unflash content because we'd have to wait until everythings rendered to access window.matchMedia(query)

  const offset = Math.max(0, 70 * (serviceOptions.length - 1));

  const marginMap: Record<number, string> = {
    0: "xl:mt-0",
    70: "xl:-mt-[70px]",
    140: "xl:-mt-[140px]",
    210: "xl:-mt-[210px]",
    280: "xl:-mt-[280px]",
    350: "xl:-mt-[350px]",
  };

  const marginClass = marginMap[offset] || "";

  const selectedServiceObject = useMemo(() => {
    return serviceOptions.find((service) => service.id === selectedServiceId);
  }, [selectedServiceId, serviceOptions]);

  return (
    <div className="xl:cols-2 m-4 flex columns-2 flex-col flex-wrap gap-6 sm:flex-row">
      {/* Have to use flex, since we have to reorder some elements on different screen sizes, which grid does not support */}
      <SignInModal isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* if the gap-6's value is changed xl:w-[calc(50%-1.5rem)] will have to be adjusted in the following sections */}
      <section className="order-1 mb-6 h-fit w-full rounded-3xl border-1 border-light-accent bg-white px-4 py-5 xl:w-[calc(50%-1.5rem)]">
        {/* //  ${serviceOptions.length > 2 ? "max-h-[calc(100%-400px)]" : ""} */}
        <div className="mb-4 justify-between sm:flex">
          <h2 className="mb-3 text-3xl font-bold sm:mb-0">
            {providerInfo.name}
          </h2>

          <div className="flex space-x-6 px-2">
            <StyledAsButton
              label="Call"
              startContent={
                <Phone
                  size={18}
                  color="gray"
                  className="group-hover:stroke-white"
                />
              }
              as="a"
              className="text-md group items-center border-1 border-light-accent text-black hover:text-white data-[hover=true]:!bg-primary"
              variant="ghost"
              href={`tel:${providerInfo.phone_number}`}
            />

            <StyledAsButton
              label="Email"
              startContent={
                <Mail
                  size={18}
                  color="gray"
                  className="group-hover:stroke-white"
                />
              }
              as="a"
              className="text-md group items-center border-1 border-light-accent text-black hover:text-white data-[hover=true]:!bg-primary"
              variant="ghost"
              href={`mailto:${providerInfo.email}`}
            />
          </div>
        </div>
        <div className="mb-4 text-xs">
          <span>
            <span className="font-semibold"> Phone: </span>
            {providerInfo.phone_number}
          </span>
          <span className="ml-4">
            <span className="font-semibold sm:inline"> Email: </span>
            {providerInfo.email}
          </span>
        </div>

        {/* Added string versions the phone number and email since the mailto and tel links can be problematic for some users. For example, they might not use the email client that mailto tries to open. However, putting these under the actual call and email links looked strange and a long email would affect the layout
        placed here to long emails don't wrap strangely (like it would in the flexed provider name box) */}
        <StarRatingReview />
        <p className="my-3"> {providerInfo.description} </p>
      </section>

      <section className="order-2 mb-6 w-full rounded-3xl border-1 border-light-accent bg-white p-4 md:w-[calc(50%-1.5rem)]">
        <h4 className="my-4 pl-2 text-2xl text-secondary-font-color">
          Select Service
        </h4>
        {/* the index is just there for development, in production the services will always be unique */}
        {/* eslint-disable react/no-array-index-key */}

        {serviceOptions.map((service, index) => (
          <IconServiceTime
            key={`${service.description} ${service.time} ${index}`}
            description={service.description}
            time={service.time}
            price={service.price}
            id={service.id}
            setSelectedServiceId={setSelectedServiceId}
          />
        ))}
      </section>

      <section className="order-3 mb-6 w-full rounded-3xl border-1 border-light-accent bg-white pl-4 pt-4 md:w-[calc(50%-1.5rem)] xl:order-4">
        <h4 className="my-4 text-2xl text-secondary-font-color">
          Book Service
        </h4>
        <h6 className="font-bold"> Select Time </h6>

        {/* we want calendar to ALWAYS be visible 
        We're putting a default of 60 to keep typescript happy (otherwise it worries that it could be undefined)
        The calendar will only be interactive after they click a service object, so in reality serviceLength will always be defined */}
        <Calendar
          providersAppointments={providerInfo.appointments}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          serviceLength={selectedServiceObject?.time ?? 60}
        />

        {selectedServiceId === undefined ? (
          <span className="block font-bold"> Please select a service</span>
        ) : (
          <span className="block font-bold">
            {`${selectedServiceObject?.description} (${selectedServiceObject?.time} mins) - $${selectedServiceObject?.price}`}
          </span>
        )}

        <StyledAsButton
          className="mb-4 mt-6 block w-11/12 px-0 disabled:bg-gray-500"
          label="Continue to Booking"
          onPress={onOpen}
          disabled={!selectedServiceId || !selectedTimeSlot}
        />
      </section>

      <section
        className={`order-4 w-full rounded-3xl border-1 border-light-accent bg-white px-2 pt-4 xl:order-3 xl:w-[calc(50%-1.5rem)] ${marginClass}`}
      >
        {/* if there is more than one service offering, then we need to move customer reviews up to fill the negative space under GreenThumbPros */}
        <h4 className="ml-4 mt-4 text-2xl text-secondary-font-color">
          Customer Reviews
        </h4>

        {fakeReviews.map((review) => (
          <ReviewCard
            key={`review-${review.customer_id}`}
            customerName={review.customer_name}
            createdAt={convertDateToTimeFromNow(review.created_at)}
            description={review.description}
            rating={review.rating}
          />
        ))}
      </section>
    </div>
  );
}
