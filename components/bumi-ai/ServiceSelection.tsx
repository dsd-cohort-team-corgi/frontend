"use client";

import React from "react";
import Calendar from "@/components/icons/Calendar";
import Star from "../icons/Star";
import CheckoutButton from "../buttons/CheckoutButton";
import StyledAsButton from "../StyledAsButton";
import formatDateTimeString from "@/utils/time/formatDateTimeString";
import convertDateToTimeFromNow from "@/utils/time/convertDateToTimeFromNow";

interface ServiceSelectionProps {
  services: ServiceRecommendation[];
  providerInfo: ServiceRecommendation | null;
  setProviderInfo: (service: ServiceRecommendation) => void;
  onClose?: () => void;
}

function ServiceSelection({
  services,
  providerInfo,
  setProviderInfo,
  onClose,
}: ServiceSelectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="space-y-3 rounded-2xl bg-slate-900/70 p-4 mb-4">
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
            <section
              key={`service-${service.id || index}-${service.name}`}
              className={`relative rounded-xl p-4 transition-all duration-200 ${
                isSelected
                  ? "bg-slate-800/80 border-2 border-primary/40"
                  : "bg-slate-800/40 hover:bg-slate-800/60 border-2 border-transparent"
              }`}
            >
              {/* Selected state subtle highlight */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white text-lg">
                    {service.name}
                  </span>
                  <span className="text-white font-bold text-lg">
                    ${service.price}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-300 mb-3">
                  <span className="font-medium">{service.provider}</span>
                  <div className="flex items-center text-[#ffd250]">
                    <Star size={16} />
                    <span className="ml-1 font-medium">{service.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center text-sm text-slate-300 mb-4">
                  <Calendar size={16} />
                  <span className="ml-2">{timeToUse}</span>
                </div>

                {services.length > 1 && (
                  <div className="flex justify-center">
                    <StyledAsButton
                      label={isSelected ? "Selected" : "Select"}
                      onPress={() => setProviderInfo(service)}
                      className={`transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white shadow-md border border-primary/30"
                          : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500"
                      }`}
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {providerInfo ? (
        <CheckoutButton
          providerInfo={providerInfo}
          className="bg-gradient-to-r from-primary to-primary/90 font-bold text-white w-full shadow-lg shadow-primary/25 border-2 border-primary/30"
          text={`Book Service $${providerInfo.price}`}
          onClose={onClose}
        />
      ) : (
        <CheckoutButton
          className="bg-slate-700 font-bold text-slate-400 w-full border-2 border-slate-600"
          providerInfo={{} as ProviderInfo | ServiceRecommendation}
          disabled
        />
      )}
    </div>
  );
}

export default ServiceSelection;
