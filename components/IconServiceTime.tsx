"use client";

import { Button } from "@heroui/react";
import React from "react";
import { Leaf } from "lucide-react";
import { useBooking } from "@/components/context-wrappers/BookingContext";

type IconServiceTimeType = {
  title: string;
  time: number;
  price: number;
  id: string;
};

export default function IconServiceTime({
  title,
  time,
  price,
  id,
}: IconServiceTimeType) {
  const { booking, updateBooking } = useBooking();

  function handlePress() {
    if (booking.serviceId === id) {
      updateBooking({
        paymentIntentId: undefined,
        serviceId: undefined,
        description: undefined,
        serviceDuration: undefined,
        price: undefined,
        location: undefined,
        time: undefined,
        date: undefined,
        serviceNotes: undefined,
      });
    } else {
      updateBooking({
        serviceId: id,
        serviceTitle: title,
        serviceDuration: time,
        price: String(price),
        paymentIntentId: undefined,
        location: undefined,
        time: undefined,
        date: undefined,
        serviceNotes: undefined,
      });
    }
  }

  return (
    <Button
      type="button"
      className={`group my-3 flex h-fit w-full flex-col flex-wrap justify-center rounded-lg border-1 border-light-accent bg-transparent p-4 text-center text-[1rem] hover:border-2 hover:border-primary sm:flex-row md:items-start lg:flex-col lg:items-center xl:flex-row xl:items-start ${booking.serviceId === id && "bg-primary text-white"}`}
      onPress={() => handlePress()}
    >
      <span
        className={`bg-slate-200p-2 group-hover:bg-slate-300 md:mr-4 md:shrink-0 lg:mr-0 xl:mr-4 ${booking.serviceId === id && "bg-primary text-white group-hover:bg-transparent"} `}
      >
        <Leaf
          className={`group-hover:stroke-primary ${booking.serviceId === id && "group-hover:stroke-white"}`}
        />
      </span>

      <div className="flex min-w-0 flex-1 flex-col flex-wrap sm:flex-row lg:flex-col xl:flex-row">
        <p className="font-bold">{title}</p>
        <span
          className={`min-w-0 text-secondary-font-color sm:ml-2 ${booking.serviceId === id && "text-white"}`}
        >
          ({time} mins)
        </span>
        <span className="min-w-0 pl-2 font-bold sm:ml-auto lg:ml-0 xl:ml-auto">{`$${price}`}</span>
      </div>
    </Button>
  );
}
