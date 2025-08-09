"use client";

import React from "react";
import Calendar from "@/components/icons/Calendar";
import Star from "../icons/Star";
import CheckoutButton from "../buttons/CheckoutButton";
import StyledAsButton from "../StyledAsButton";
import formatDateTimeString from "@/utils/formatDateTimeString";
import convertDateToTimeFromNow from "@/utils/convertDateToTimeFromNow";

interface ServiceSelectionProps {
  services: ServiceRecommendation[];
  providerInfo: ServiceRecommendation | null;
  setProviderInfo: (service: ServiceRecommendation) => void;
}

function ServiceSelection({
  services,
  providerInfo,
  setProviderInfo,
}: ServiceSelectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-slate-900/70 p-3">
      <div className="space-y-2">
        {services.map((service, index) => {
          const timeFromNow = convertDateToTimeFromNow(service.available_time);
          const timeUnitsIgnore = ["day", "week", "month", "year"];
          const hasBigTimeUnit = timeUnitsIgnore.some((unit) =>
            timeFromNow.includes(unit),
          );
          const isSelected = providerInfo?.id === service.id;

          const formattedTime = formatDateTimeString(service.available_time);

          const timeToUse = hasBigTimeUnit
            ? `${formattedTime.datePart} ${formattedTime.timePart}`
            : timeFromNow;

          return (
            <section key={`service-${service.id || index}-${service.name}`}>
              <div className="flex justify-between">
                <span className="font-medium">{service.name}</span>
                <span> ${service.price} </span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>{service.provider}</span>
                <div className="my-1 flex items-center text-[#ffd250]">
                  <Star size={14} />
                  <span className="ml-px inline-block"> {service.rating} </span>
                </div>
              </div>
              <p className="py-1 text-sm text-slate-300">
                {service.description}
              </p>
              <div className="flex items-center text-sm text-slate-300">
                <Calendar size={16} />
                <span className="ml-1">{timeToUse}</span>
              </div>

              {services.length > 1 && (
                <div className="flex justify-center">
                  <StyledAsButton
                    label={isSelected ? "selected" : "select"}
                    onPress={() => setProviderInfo(service)}
                    className={
                      isSelected ? "bg-white text-black" : "bg-primary"
                    }
                  />
                </div>
              )}
            </section>
          );
        })}

        {providerInfo ? (
          <CheckoutButton
            providerInfo={providerInfo}
            className="bg-white font-bold text-black"
            text={`Book Service $${providerInfo.price}`}
          />
        ) : (
          <CheckoutButton
            providerInfo={{} as ProviderInfo | ServiceRecommendation}
            disabled
          />
        )}
      </div>
    </div>
  );
}

export default ServiceSelection;
