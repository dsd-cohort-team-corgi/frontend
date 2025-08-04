import { Card, CardHeader, Chip } from "@heroui/react";
import React from "react";

interface ProviderBookingCardProps {
  special_instructions: string;
  start_time: string;
  service_notes: string;
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
}

function ProviderBookingCard({
  status,
  start_time,
  service_notes,
}: ProviderBookingCardProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <Chip>{status}</Chip>
        <div className="flex flex-col">
          <span></span>
        </div>
      </CardHeader>
    </Card>
  );
}

export default ProviderBookingCard;
