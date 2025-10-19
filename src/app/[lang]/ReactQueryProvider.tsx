"use client";

import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TIME_CONSTANTS } from "@/shared/lib/constants";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data 5 daqiqa davomida "fresh" hisoblanadi
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Data 10 daqiqa davomida cache'da saqlanadi
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        // Background refetch'ni o'chirish (performance uchun)
        refetchOnWindowFocus: false,
        // Network qayta ulanganda refetch qilish
        refetchOnReconnect: true,
        // Retry strategiya
        retry: (failureCount, error) => {
          // 401, 403, 404 kabi error'larda retry qilmaslik
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status;
            if ([401, 403, 404].includes(status)) {
              return false;
            }
          }
          // Boshqa error'larda 3 marta retry qilish
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Mutation'larda ham retry strategiya
        retry: (failureCount, error) => {
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status;
            if ([400, 401, 403, 404, 422].includes(status)) {
              return false;
            }
          }
          return failureCount < 2;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
