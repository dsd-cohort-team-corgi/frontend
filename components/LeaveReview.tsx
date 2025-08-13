"use client";

import { useDisclosure } from "@heroui/react";
import { useState, useEffect } from "react";
import MessageSquare from "./icons/MessageSquare";
import StyledAsButton from "./StyledAsButton";
import Star from "./icons/Star";
import ReviewModal from "./ReviewModal";
import formatDateTimeString from "@/utils/time/formatDateTimeString";

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
  const [isMobile, setIsMobile] = useState(false);
  const dateFromStartTime = formatDateTimeString(start_time);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-sm">
            <MessageSquare color="#16a34a" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900">
              {service_title}
            </h3>
            <p className="text-sm text-gray-700 font-medium">{company_name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>✅</span>
              Completed {dateFromStartTime.datePart}
            </p>
          </div>
        </div>
        <StyledAsButton
          startContent={<Star size={isMobile ? 16 : 18} />}
          label="Leave Review"
          className="bg-green hover:bg-green-700 text-white text-sm px-4 py-2 h-10 font-medium transition-colors duration-200"
          onPress={onOpen}
        />
      </div>
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
