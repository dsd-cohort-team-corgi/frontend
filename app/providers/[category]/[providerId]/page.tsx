import React from "react";
import { Button } from "@heroui/react";
import EmailIcon from "@/components/icons/Email";
import PhoneIcon from "@/components/icons/Phone";
import StarRatingReview from "@/components/ProviderOverallRatingInfo";
import IconServiceTime from "@/components/IconServiceTime";
import ReviewCard from "@/components/ReviewCard";
import StyledAsButton from "@/components/StyledAsButton";

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
  const providerEmail = "provider@gmail.com";
  const providerPhone = "999-111-1111";

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
          <div>
            <h2 className="text-2xl font-bold">{providerName}</h2>
            <span className="text-sm">{`Phone: ${providerPhone}`} </span>
            <span className="ml-4 text-sm">{`Email: ${providerEmail}`} </span>
            {/* Added here since the mailto and tel links can be problematic for some users. For example, they might not use the email client that mailto tries to open 
            However, putting these under the actual call and email links looked strange and a long email would affect the layout. So placing it under the provider's name is likely the best choice */}
          </div>
          <div className="flex space-x-6">
            <StyledAsButton
              label="Call"
              startContent={<PhoneIcon />}
              as="a"
              className="group items-center border-none text-black hover:text-white data-[hover=true]:!bg-primary"
              variant="ghost"
              href={`tel:${providerPhone}`}
            />

            <StyledAsButton
              label="email"
              variant="ghost"
              className="group items-center border-none text-black hover:text-white data-[hover=true]:!bg-primary"
              startContent={<EmailIcon />}
              href={`mailto:${providerEmail}`}
            />
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
