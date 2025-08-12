"use client";

import { useEffect, useState } from "react";
import Calendar from "./icons/Calendar";
import formatDateTimeString from "@/utils/formatDateTimeString";
import CircleCheck from "./icons/CircleCheck";
import ChevronDown from "./icons/ChevronDown";

interface BookingItem {
  provider_company_name: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  start_time: string;
  service_title: string;
}

function UpcomingService({
  provider_company_name,
  status,
  start_time,
  service_title,
}: BookingItem) {
  const [bookingStatus, setBookingStatus] = useState<string>(status);
  /* eslint-disable no-undef-init */
  let serviceDateAndTime: { datePart: string; timePart: string } | undefined =
    undefined;
  if (start_time) {
    serviceDateAndTime = formatDateTimeString(start_time ?? "");
  }
  let statusChipColor;
  if (bookingStatus === "cancelled") {
    statusChipColor = "#DC2626";
  } else {
    statusChipColor = "#2563eb";
  }
  useEffect(() => {
    setBookingStatus(status);
  }, [status]);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div
          className={`flex size-10 items-center justify-center rounded-full  shadow-sm ${
            bookingStatus === "cancelled"
              ? "bg-gradient-to-br from-red-100 to-red-200"
              : "bg-gradient-to-br from-blue-100 to-blue-200"
          }`}
        >
          <Calendar color={statusChipColor} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">
            {service_title}
          </h3>
          <p className="text-sm text-gray-700 font-medium">
            {provider_company_name}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>📅</span>
            {serviceDateAndTime?.datePart} at {serviceDateAndTime?.timePart}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm ${bookingStatus === "cancelled" ? "text-red-700 bg-red-50" : "text-blue-700 bg-blue-50"}`}
        >
          <CircleCheck size={16} color={statusChipColor} />
          <span className="capitalize">{status}</span>
        </div>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronDown color="#6b7280" />
        </button>
      </div>
    </div>
  );
}

export default UpcomingService;
