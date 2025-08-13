import { NextResponse } from "next/server";
import ical from "ical-generator";

interface BookingData {
  start_time: string;
  service_id: number;
  customer_id: number;
  address_id: string;
}

interface ServiceData {
  service_title: string;
  service_description?: string;
  duration?: number;
}

interface AddressData {
  customer_id: number;
  street_address_1: string;
  city: string;
  state: string;
  zip: string;
}

interface Params {
  bookingId: string;
}
// disabled this rule as I was getting build errors
/* eslint-disable import/prefer-default-export */
export async function GET(
  request: Request,
  { params }: { params: Params },
): Promise<NextResponse | undefined> {
  const { bookingId } = params;

  try {
    const bookingResponse = await fetch(
      `https://maidyoulook-backend.onrender.com/bookings/${bookingId}`,
    );
    const bookingData: BookingData = await bookingResponse.json();

    const serviceResponse = await fetch(
      `https://maidyoulook-backend.onrender.com/services/${bookingData.service_id}`,
    );
    const serviceData: ServiceData = await serviceResponse.json();

    const addressResponse = await fetch(
      `https://maidyoulook-backend.onrender.com/addresses/${bookingData.address_id}`,
    );

    const address: AddressData = await addressResponse.json();
    // having to pull in all address data. There is no way to find an address using an address ID

    // brought in an npm package to handle ics
    const cal = ical({ name: serviceData.service_title });

    cal.createEvent({
      start: bookingData?.start_time
        ? new Date(bookingData.start_time)
        : new Date(),
      end: serviceData?.duration
        ? new Date(
            new Date(bookingData.start_time).getTime() +
              serviceData.duration * 60 * 1000,
          )
        : new Date(Date.now() + 3600 * 1000),
      summary: serviceData?.service_description
        ? serviceData?.service_description
        : "Wipe Right Service Provider",
      description: serviceData?.service_description
        ? serviceData?.service_description
        : "Wipe Right Service Provider",
      location: address
        ? `${address.street_address_1} ${address.city}, ${address.state}, ${address.zip}`
        : "virtual",
      url: `http://localhost:3000/booking-confirmation/${bookingId}`,
    });

    // Set headers for ICS file download
    return new NextResponse(cal.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": 'attachment; filename="event.ics"',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate calendar event" },
      { status: 500 },
    );
  }
}
