import React, { useState } from "react";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { formatDateTimeString } from "@/utils/formatDateTimeString";
import MapPin from "./icons/MapPin";
import Clock from "./icons/Clock";
import ChevronDown from "./icons/ChevronDown";
import StyledAsButton from "./StyledAsButton";
import Play from "./icons/Start";
import Phone from "./icons/Phone";
import MessageSquare from "./icons/MessageSquare";

interface ProviderBookingCardProps {
  special_instructions: string;
  start_time: string;
  status:
    | "confirmed"
    | "en_route"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "review_needed";
  service_title: string;
  pricing: number;
  duration: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  zip: string;
}

function ProviderBookingCard({
  status,
  start_time,
  special_instructions,
  service_title,
  pricing,
  duration,
  first_name,
  last_name,
  phone_number,
  street_address_1,
  street_address_2,
  city,
  state,
  zip,
}: ProviderBookingCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const { timePart } = formatDateTimeString(start_time);

  // tailwind could not do colors on the fly, created this to set chip status colors
  let statusChipColor;
  if (status === "confirmed") {
    statusChipColor = "2563eb";
  } else if (status === "en_route") {
    statusChipColor = "EA580C";
  } else if (status === "cancelled") {
    statusChipColor = "DC2626";
  }

  // object for framer motion drop down animation
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        opacity: { duration: 0.2 },
        height: { duration: 0.3, ease: "easeInOut" as Easing },
        y: { duration: 0.3, ease: "easeOut" as Easing },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        height: { duration: 0.3, ease: "easeInOut" as Easing },
        y: { duration: 0.3, ease: "easeIn" as Easing },
      },
    },
  };

  const handleClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Card className="relative mb-2 mt-4">
        <CardHeader className="flex items-start justify-between">
          {/* havingto use style here to dynamically inject background color. Tailwind seemingly can not inject background color on the fly */}
          <Chip
            style={{ backgroundColor: `#${statusChipColor}` }}
            className="text-white lg:text-lg"
          >
            {status}
          </Chip>
          <div className="flex flex-col">
            <span className="font-black lg:text-xl">${pricing}</span>
            <span className="text-sm text-light-font-color lg:text-base">
              {duration} min
            </span>
          </div>
        </CardHeader>
        <CardBody className="mb-4 flex flex-col gap-1">
          <p className="lg:text-lg">{service_title}</p>
          <p className="text-small text-light-font-color lg:text-base">
            {first_name} {last_name}
          </p>
          <div className="flex items-center gap-1">
            <div className="basis-[20px]">
              <Clock color="#62748e" size={16} />
            </div>
            <span>{timePart}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="basis-[20px]">
              <MapPin color="#62748e" size={16} />
            </div>
            <div>
              <p>
                {street_address_1}
                {street_address_2},
              </p>
              <p>
                {city}, {state} {zip}
              </p>
            </div>
          </div>
        </CardBody>
        <div
          className={`absolute bottom-1 right-2 transition-transform duration-300 ease-in-out ${
            isDropDownOpen ? "rotate-0" : "-rotate-90"
          }`}
        >
          <ChevronDown color="#62748e" />
        </div>
      </Card>
      <AnimatePresence>
        {isDropDownOpen && (
          <motion.div
            key="dropdown-content"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <Card className="border-1 border-light-accent bg-[#f2f2f2]">
              <CardHeader className="lg:text-lg">
                Special Instructions
              </CardHeader>
              <CardBody className="pt-0">
                <div className="rounded-lg border-1 border-light-accent bg-white p-1 text-light-font-color lg:text-lg">
                  {special_instructions || "N/A"}
                </div>
                <StyledAsButton
                  className="mt-2 border-1 border-light-accent bg-orange-600 lg:text-lg"
                  startContent={
                    <Play size={window.innerWidth >= 1024 ? 20 : 16} />
                  }
                  label="Start Work"
                />
                <div className="md:flex md:gap-1">
                  <a href={`tel:${phone_number}`} className="w-full">
                    <StyledAsButton
                      className="mt-2 w-full border-1 border-light-accent bg-white text-black lg:text-lg"
                      startContent={
                        <Phone size={window.innerWidth >= 1024 ? 20 : 16} />
                      }
                      label="Call"
                    />
                  </a>
                  <a href={`sms:${phone_number}`} className="w-full">
                    <StyledAsButton
                      className="mt-2 w-full border-1 border-light-accent bg-white text-black lg:text-lg"
                      startContent={
                        <MessageSquare
                          size={window.innerWidth >= 1024 ? 20 : 16}
                        />
                      }
                      label="Text"
                    />
                  </a>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default ProviderBookingCard;
