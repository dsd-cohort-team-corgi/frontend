"use client";

import React from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";

export default function CardWithImage() {
  return (
    <Card className="shadow-none">
      <CardHeader className="relative">
        {/* <p className="text-tiny font-bold uppercase">Daily Mix</p>
        <small className="text-default-500">12 Tracks</small>
        <h4 className="text-large font-bold">Frontend Radio</h4> */}
        <Image
          alt="Card background"
          className="object-fit rounded-[10%]"
          src="/house-cleaning.png"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <span className="absolute left-10 top-10 z-40 inline-block items-center rounded-2xl bg-gray-900 px-4 py-1 text-center text-sm font-semibold uppercase text-white">
          {" "}
          From $40{" "}
        </span>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <h3 className="pb-4 text-3xl font-bold">Home and Garden</h3>
        <p className="text-gray-500">text text text</p>
      </CardBody>
    </Card>
  );
}
