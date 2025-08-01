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

    companyName?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    price?: string;
    serviceDuration?: number;
    location?: string;
    time?: string;
    date?: Date;
    serviceNotes?: string;
  };

  export interface ProviderService {
    id: string;
    service_title: string;
    service_description: string;
    pricing: number;
    duration: number;
    category: string;
  }

  export interface ProviderInfo {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    phone_number: string;
    services: ProviderService[];
    reviews: string[];
    review_count: number;
    average_rating: number | null;
  }
}

// Due to Property 'google' does not exist on type 'Window & typeof globalThis error in googleSignInButton component
