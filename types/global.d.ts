declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (el: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
