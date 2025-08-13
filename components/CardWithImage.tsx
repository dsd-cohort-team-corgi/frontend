"use client";

import React from "react";
import { Card, CardHeader, CardBody, type CardProps } from "@heroui/react";

import NextImage from "next/image";

import Link from "next/link";

type Service = { [key: string]: string };

type CardWithImageProps = CardProps & {
  service: Service;
};

export default function CardWithImage({
  service,
  ...CardProps
}: CardWithImageProps) {
  return (
    /* eslint-disable react/jsx-props-no-spreading */

    <Link href={service.href}>
      <Card {...CardProps}>
        <CardHeader className="relative aspect-[2/2]">
          <NextImage
            alt={service.alt}
            className="rounded-[10%] object-cover"
            src={service.image}
            fill
          />

          <div className="absolute inset-0 z-30 rounded-[10%] bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />

          <span className="absolute left-4 top-3 z-40 inline-block items-center rounded-3xl bg-primary-font-color px-3 py-1 text-center text-sm font-semibold uppercase text-white">
            {" "}
            {`From $${service.price}`}
          </span>
        </CardHeader>
        <CardBody className="overflow-visible">
          <h3 className="py-2 text-xl font-bold text-primary-font-color">
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
