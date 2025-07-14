"use client";

import React from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";

type Service = { [key: string]: string };

export default function CardWithImage({ service }: { service: Service }) {
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
        <span className="bg-font-primary absolute left-6 top-6 z-40 inline-block items-center rounded-2xl px-4 py-1 text-center text-sm font-semibold uppercase text-white">
          {" "}
          {`From $${service.price}`}
        </span>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <h3 className="text-font-primary pb-4 text-3xl font-bold">
          Home and Garden
        </h3>
        <p className="text-font-secondary">text text text</p>
      </CardBody>
    </Card>
  );
}
