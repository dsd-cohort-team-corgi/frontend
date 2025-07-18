import React from "react";
import { Button } from "@heroui/react";
import EmailIcon from "@/components/icons/Email";
import PhoneIcon from "@/components/icons/Phone";
import StarRatingReview from "@/components/ProviderOverallRatingInfo";
import IconServiceTime from "@/components/IconServiceTime";
import ReviewCard from "@/components/ReviewCard";

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
  const providerDescription =
    "this is the providers description from the database";
  const providerName = "GreenThumb Pros";

  const serviceOptions = [
    { description: "Lawn Mowing", time: 60, price: 65 },
    { description: "Garden Maintence", time: 90, price: 85 },
    { description: "Garden Maintence", time: 120, price: 120 },
  ];

  const fakeReviews = [
    {
      customerId: 1267673,
      customerName: "Sarah Johnson",
      reviewTime: "2 weeks",
      reviewText:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      reviewRating: 5,
    },
    {
      customerId: 1245351323,
      customerName: "Evil Corgi",
      reviewTime: "12 weeks",
      reviewText:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      reviewRating: 5,
    },
    {
      customerId: 134243231323,
      customerName: "Chaotic Neutral Corgi",
      reviewTime: "15 weeks",
      reviewText:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      reviewRating: 5,
    },
    {
      customerId: 12453453,
      customerName: "Sir Barksworth II",
      reviewTime: "6 weeks",
      reviewText:
        "Great service! Very professional and thorough. Mike arrived on time and did an excellent job on my lawn. The attention to detail was impressive.",
      reviewRating: 5,
    },
  ];

  return (
    <div>
      <section>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">{providerName}</h2>
          <div className="space-x-6">
            <Button
              variant="ghost"
              // ghost turns the bg-transparent

              // prettier-ignore
              className=" items-center border-none  data-[hover=true]:!bg-primary hover:text-white group"
              // did prettier ignore so it doesn't move the data to the top of the className, we want data to stay at the end

              // ! to override heroui's default grey hover styling which otherwise beats out tailwindcss's styling because of heroui's high specificity:
              // dev tools showed: .data-\[hover\=true\]\!bg-default[data-hover="true"] { --tw-bg-opacity: 1 !important; background-color: hsl(var(--heroui-default))
              startContent={<PhoneIcon />}
            >
              <span> Call </span>
            </Button>
            <Button
              variant="ghost"
              className="items-center border-none"
              startContent={<EmailIcon />}
            >
              Email
            </Button>
          </div>
        </div>
        <StarRatingReview />
        <p> {providerDescription} </p>
      </section>

      <section>
        <h4> Select Service</h4>
        {serviceOptions.map((service) => (
          <IconServiceTime
            key={`${service.description}`}
            description={service.description}
            time={service.time}
            price={service.price}
          />
        ))}
      </section>

      <section>
        <h4>Customer Reviews</h4>

        {fakeReviews.map((review) => (
          <ReviewCard
            key={`review-${review.customerId}`}
            // customer name can be duplicated, customer id won't be
            customerName={review.customerName}
            reviewTime={review.reviewTime}
            reviewText={review.reviewText}
            reviewRating={review.reviewRating}
          />
        ))}
      </section>

      <section>Book Service</section>
      <p>Category: {category}</p>
    </div>
  );
}
