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
  /* eslint-disable no-undef-init */
  let serviceDateAndTime: { datePart: string; timePart: string } | undefined =
    undefined;
  if (start_time) {
    serviceDateAndTime = formatDateTimeString(start_time ?? "");
  }
  return (
    <div className="mb-4 flex-row items-center justify-between md:flex">
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        {/* using basis so icons don't shrint in small screens */}
        <div className="flex h-10 basis-[45px] items-center justify-center rounded-full bg-blue-100">
          <Calendar color="#2563eb" />
        </div>
        <div className="text-right md:text-left">
          <h3 className="text-lg font-bold lg:text-xl">{service_title}</h3>
          <p className="lg:text-lg">{provider_company_name}</p>
          {/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */}
          <p className="text-pretty text-xs text-light-font-color lg:text-base">
            {serviceDateAndTime?.datePart} at {serviceDateAndTime?.timePart}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-lg py-[2px] text-right text-[#2563eb] md:text-left lg:gap-4">
        <div className="flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-[2px] text-right md:text-left">
          <CircleCheck size={16} color="#2563eb" />
          <span>{status}</span>
        </div>
        <ChevronDown color="#62748e" />
      </div>
    </div>
  );
}

export default UpcomingService;
