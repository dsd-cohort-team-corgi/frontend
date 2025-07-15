"use client";

import React from "react";
import { Card, CardHeader, CardBody, type CardProps } from "@heroui/react";

import NextImage from "next/image";
// I used NextImage directly instead of HeroUI's image with the as={NextImage} because it kept glitching (showing a white screen instead of the image) when using fill. Spending longer to continue debugging for some minor styling benefits isn't worth it.

import Link from "next/link";

type Service = { [key: string]: string };

type CardWithImageProps = CardProps & {
  service: Service;
};
// CardProps = letting use use HeroUi card props
// but it also understands the types of our service object

export default function CardWithImage({
  service,
  ...CardProps
}: CardWithImageProps) {
  return (
    /* eslint-disable react/jsx-props-no-spreading */

    <Link href={service.href}>
      <Card {...CardProps}>
        <CardHeader className="relative aspect-[2/2]">
          {/* aspect-[2/2] will give this element a height and ensure it is a square, otherwise only a tiny sliver of the image will be visible.  
          Relative is needed for fill to work properly, otherwise it will use the "next" relative element it sees, the entire card */}
          <NextImage
            alt={service.alt}
            className="rounded-[10%] object-cover"
            src={service.image}
            fill
            // fill automatically gives the image a position of absolute under the hood, so it can expand to the size of its relatively positioned parent element
          />

          <div className="absolute inset-0 z-30 rounded-[10%] bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
          {/* absolute inset-0 stretch to cover the closest relative element it is inside (CardHeader, aka the image in tnis case)
          group-hover:opacity-50 when the outer "group" is hovered over, changes from 0 to 50% opacity
            */}

          <span className="absolute left-6 top-4 z-40 inline-block items-center rounded-3xl bg-primary-font-color px-5 py-2 text-center text-medium font-semibold uppercase text-white md:px-3 md:py-1 md:text-sm lg:px-5 lg:py-2 lg:text-medium">
            {" "}
            {`From $${service.price}`}
          </span>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <h3 className="pb-4 text-xl font-bold text-primary-font-color">
            {service.label}
          </h3>
          <p className="text-base text-secondary-font-color">
            {service.description}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
}
