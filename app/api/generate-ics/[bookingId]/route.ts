import { NextResponse } from 'next/server';
import ical from 'ical-generator';

export async function GET(request, { params }) {
    const { bookingId } = params

    try {

        const bookingResponse = await fetch(`http://127.0.0.1:8000/bookings/${bookingId}`)
        const bookingData = await bookingResponse.json()
        const serviceResponse = await fetch(`http://127.0.0.1:8000/services/${bookingData.service_id}`)
        const serviceData = await serviceResponse.json()
        const addressResponse = await fetch(`http://127.0.0.1:8000/addresses`)
        const addressData = await addressResponse.json()

        const address = addressData.find((address) => address.customer_id === bookingData.customer_id)


        const cal = ical({ name: serviceData.service_title });

        cal.createEvent({
            start: bookingData?.start_time ? new Date(bookingData.start_time) : new Date(),
            end: serviceData?.duration
                ? new Date(
                    new Date(bookingData.start_time).getTime() +
                    serviceData.duration * 60 * 1000
                )
                : new Date(Date.now() + 3600 * 1000),
            summary: serviceData?.service_description ? serviceData?.service_description : 'Wipe Right Service Provider',
            description: serviceData?.service_description ? serviceData?.service_description : 'Wipe Right Service Provider',
            location: address ? `${address.street_address_1} ${address.city}, ${address.state}, ${address.zip}` : 'virtual',
            url: `http:localhost:3000/booking-confirmation/${bookingId}`,
        });

        // Set headers for ICS file download
        return new NextResponse(cal.toString(), {
            status: 200,
            headers: {
                'Content-Type': 'text/calendar',
                'Content-Disposition': 'attachment; filename="event.ics"',
            },
        });
    } catch (err) {
        console.error(err)
    }
}