import React from "react";
import EmailIcon from "@/components/icons/Email";
import PhoneIcon from "@/components/icons/Phone";
import StarRatingReview from "@/components/ProviderOverallRatingInfo";
import IconServiceTime from "@/components/IconServiceTime";
import ReviewCard from "@/components/ReviewCard";
import StyledAsButton from "@/components/StyledAsButton";
import convertDateToTimeFromNow from "@/utils/convertDateToTimeFromNow";

// https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#convention
// the docs are showing the Next.JS 15 behavior where params is a promise
// however for Next.js 14 it is synchronous prop
type ProviderProps = {
  category: string;
  providerId: string;
};
export default function page({ params }: { params: ProviderProps }) {
  const { category, providerId } = params;
  // params must match dynamic folder names,providerid !== providerId
  const providerInfo = {
    description: "this is the providers description from the database",
    name: "GreenThumb Pros",
    email: "provider@gmail.com",
    phone_number: "999-111-1111",
  };

  const serviceOptions = [
    { description: "Lawn Mowing", time: 60, price: 65 },
    { description: "Garden Maintence", time: 90, price: 85 },
    { description: "Garden Maintence", time: 120, price: 120 },
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
      rating: 5,
    },
    {
      customer_id: 134243231323,
      customer_name: "Chaotic Neutral Corgi",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 5,
    },
    {
      customer_id: 12453453,
      customer_name: "Sir Barksworth II",
      created_at: "2025-07-05T14:23:45.123456+00:00",
      updated_at: "",
      description:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      rating: 5,
    },
  ];

  return (
    <div className="m-4 flex flex-col sm:flex-row sm:flex-wrap">
      {/* Have to use flex, since we have to reorder some elements on different screen sizes, which grid does no support */}

      {/* can't use gap-x-4 because of w-1/2 I could of used xl:w-[calc(50%-0.5rem)] but that is less easy to understand & its less dry that just adding padding, and if we changed gap's size we'd have to adjust there too */}
      <section className="order-1 mb-6 w-full xl:w-1/2">
        <div className="flex justify-between">
          <div className="mb-1">
            <h2 className="mb-1 text-2xl font-bold">{providerInfo.name}</h2>
            <span className="text-sm">
              <span className="font-semibold"> Phone: </span>
              {providerInfo.phone_number}
            </span>
            <span className="ml-4 text-sm">
              <span className="font-semibold"> Email: </span>
              {providerInfo.email}
            </span>
            {/* Added here since the mailto and tel links can be problematic for some users. For example, they might not use the email client that mailto tries to open 
            However, putting these under the actual call and email links looked strange and a long email would affect the layout. So placing it under the provider's name is likely the best choice */}
          </div>
          <div className="flex space-x-6 px-2">
            <StyledAsButton
              label="Call"
              startContent={<PhoneIcon />}
              as="a"
              className="group items-center border-none text-black hover:text-white data-[hover=true]:!bg-primary"
              variant="ghost"
              href={`tel:${providerInfo.phone_number}`}
            />

            <StyledAsButton
              label="Email"
              startContent={<EmailIcon />}
              as="a"
              className="group items-center border-none text-black hover:text-white data-[hover=true]:!bg-primary"
              variant="ghost"
              href={`mailto:${providerInfo.email}`}
            />
          </div>
        </div>
        <StarRatingReview />
        <p className="my-2"> {providerInfo.description} </p>
      </section>

      <section className="order-2 w-full px-2 lg:order-2 lg:w-1/2">
        <h4 className="my-4 text-lg text-secondary-font-color">
          Select Service
        </h4>
        {serviceOptions.map((service) => (
          <IconServiceTime
            key={`${service.description}`}
            description={service.description}
            time={service.time}
            price={service.price}
          />
        ))}
      </section>

      <section className="order-3 w-full px-2 lg:w-1/2 xl:order-4">
        <h4 className="my-4 text-lg text-secondary-font-color">
          {" "}
          Book Service
        </h4>
        <h6> Select Time </h6>
        <span className="block"> Tuesday, July 15, 2025 at 11:00 AM </span>
        <span className="block"> Lawn Mowing - $80 </span>
        <StyledAsButton className="block w-full" label="Continue to Booking" />
      </section>

      <section className="order-4 w-full px-2 xl:order-3 xl:w-1/2">
        <h4 className="my-4 text-lg text-secondary-font-color">
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
