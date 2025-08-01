export {};

declare global {
  interface Window {
    google?: typeof google;
  }

  type Appointment = {
    start_time: string; // ISO date string
    duration: number; // duration in minutes
  };

  type BookingDetailsType = {
    paymentIntentId?: string;
    serviceId?: string;
    customerId?: string;
    providerId?: string;

    description?: string;
    price?: string;
    serviceCost?: number;
    serviceDuration?: number;
    location?: string;
    time?: string;
    date?: Date;
    serviceNotes?: string;
  };
}

// Due to Property 'google' does not exist on type 'Window & typeof globalThis error in googleSignInButton component
