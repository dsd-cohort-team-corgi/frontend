import Calendar from "./icons/Calendar";
import { BookingItem } from "@/app/page";
import { formatDateTimeString } from "@/utils/formatDateTimeString";
function UpcomingService({
  provider_company_name,
  provider_first_name,
  provider_last_name,
  status,
  start_time,
  service_title,
}: BookingItem) {
  let serviceDateAndTime: { datePart: string; timePart: string } | undefined =
    undefined;
  if (start_time) {
    serviceDateAndTime = formatDateTimeString(start_time ?? "");
  }
  return (
    <div className="flex-row items-center justify-between lg:flex">
      <div className="flex flex-row items-center justify-between gap-2">
        {/* using basis so icons don't shrint in small screens */}
        <div className="flex h-10 w-10 basis-[55px] items-center justify-center rounded-full bg-blue-100">
          <Calendar color="#2563eb" />
        </div>
        <div className="basis-64 text-right">
          <h3 className="text-lg font-bold">{service_title}</h3>
          <p>{provider_company_name}</p>
          <p className="text-light-font-color text-pretty text-xs">
            {serviceDateAndTime?.datePart} at {serviceDateAndTime?.timePart}
          </p>
        </div>
      </div>
      <div className="text-right">{status}</div>
    </div>
  );
}

export default UpcomingService;
