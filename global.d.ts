export {};

declare global {
  interface Window {
    google?: typeof google;
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }

  type AuthDetailsType = {
    displayName?: string;
    phoneNumber?: string;
    email?: string;
    supabaseUserId?: string;
    avatarUrl?: string;
    customerId?: string;
    providerId?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  // all are optional, because the auth context will start as a blank object

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
    reviews: Review[];
    review_count: number;
    average_rating: number | null;
  }

  type ReviewType = {
    rating: number;
    description: string;
    created_at: string; // ISO date string
    customer_name: string;
  };
}

// Due to Property 'google' does not exist on type 'Window & typeof globalThis error in googleSignInButton component
