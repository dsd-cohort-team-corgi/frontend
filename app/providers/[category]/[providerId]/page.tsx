import React from "react";
import { Button } from "@heroui/react";
import Email from "@/components/icons/Email";
import Phone from "@/components/icons/Phone";
import ReviewStars from "@/components/ReviewStars";
import StarRatingReview from "@/components/StarRatingReview";

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

  return (
    <div>
      <section>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">{providerName}</h2>
          <div className="space-x-6">
            <Button
              variant="ghost"
              // ghost turns the bg-transparent
              className="border-none"
              // gets rid of the default border heroUI adds
              startContent={<Phone />}
            >
              Call
            </Button>
            <Button
              variant="ghost"
              className="border-none"
              startContent={<Email />}
            >
              Call
            </Button>
          </div>
        </div>
        <StarRatingReview />
        <p> {providerDescription} </p>
      </section>

      <section>
        <h4> Select Service</h4>
      </section>

      <section>
        {" "}
        <ReviewStars />{" "}
      </section>

      <section>Book Service</section>
      <p>Category: {category}</p>
    </div>
  );
}
