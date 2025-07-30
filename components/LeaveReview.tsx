"use client";

import { Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import MessageSquare from "./icons/MessageSquare";
import StyledAsButton from "./StyledAsButton";
import Star from "./icons/Star";
import ReviewModal from "./ReviewModal";

interface BookingItem {
  company_name: string;
  start_time: string;
  service_title: string;
}

function LeaveReview({ service_title, company_name, start_time }: BookingItem) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Card className="bg-green-100">
        <CardHeader>
          {" "}
          <MessageSquare color="#187a24" />
          Share Your Experience
        </CardHeader>
        <CardBody>
          <h3>{service_title}</h3>
          <p>{company_name}</p>
          <p>{start_time}</p>
          <StyledAsButton
            startContent={<Star size={16} />}
            label="Leave Review"
            className="bg-[#187a24]"
            onPress={onOpen}
          />
        </CardBody>
      </Card>
      <ReviewModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}

export default LeaveReview;
