"use client";

import { Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import MessageSquare from "./icons/MessageSquare";
import StyledAsButton from "./StyledAsButton";
import Star from "./icons/Star";
import ReviewModal from "./ReviewModal";
import { formatDateTimeString } from "@/utils/formatDateTimeString";
import { useEffect } from "react";

interface BookingItem {
  company_name: string;
  start_time: string;
  service_title: string;
  customer_id: string;
  provider_id: string;
}

function LeaveReview({
  service_title,
  company_name,
  start_time,
  customer_id,
  provider_id,
}: BookingItem) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const dateFromStartTime = formatDateTimeString(start_time);

  return (
    <>
      <Card className="mb-4 bg-green-100 lg:px-4">
        <CardHeader>
          {" "}
          <MessageSquare color="#187a24" />
          <span className="ml-2 text-lg font-semibold lg:text-xl">
            Share Your Experience
          </span>
        </CardHeader>
        <CardBody className="md:flex md:flex-row md:justify-between lg:text-lg">
          <div>
            <h3 className="font-semibold">{service_title}</h3>
            <p>{company_name}</p>
            <p className="text-light-font-color">
              Completed on {dateFromStartTime.datePart}
            </p>
          </div>
          <StyledAsButton
            startContent={<Star size={window.innerWidth >= 768 ? 20 : 16} />}
            label="Leave Review"
            className="my-4 bg-[#187a24] lg:text-lg"
            onPress={onOpen}
          />
        </CardBody>
      </Card>
      <ReviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        service_title={service_title}
        company_name={company_name}
        customer_id={customer_id}
        provider_id={provider_id}
      />
    </>
  );
}

export default LeaveReview;
