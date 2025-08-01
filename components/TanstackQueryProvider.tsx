"use client";

// since this is a client component we need to pass children to it for our server components e.g. our root layout
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// this dependency is only used in dev, disabling rule so it does not error during build
/* eslint-disable import/no-extraneous-dependencies */
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default TanstackQueryProvider;
