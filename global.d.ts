export {};

declare global {
  interface Window {
    google?: typeof google;
  }
}

// Due to Property 'google' does not exist on type 'Window & typeof globalThis error in googleSignInButton component
