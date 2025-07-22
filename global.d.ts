export {};

declare global {
  interface Window {
    google?: typeof google;
  }

  type Appointment = {
    start_time: string; // ISO date string
    duration: number; // duration in minutes
  };
}

// Due to Property 'google' does not exist on type 'Window & typeof globalThis error in googleSignInButton component
