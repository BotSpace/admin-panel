"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { queryGenerator } from "@/lib/query-generator";
import { useDebounces } from "@/hooks/use-debounces";
import { instanceAuth } from "../instance";

export const useReactQueryAction = <T>({
  url,
  query,
  debounceTime,
  enabled = true,
}: {
  url: string;
  query?: Record<string, any>;
  debounceTime?: number;
  enabled?: boolean;
}) => {
  const params = useParams();

  Object.keys(params).forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, "g");
    const value = Array.isArray(params[key])
      ? params[key]?.[0] // agar array bo'lsa — birinchi elementni olamiz
      : params[key];

    if (value !== undefined) {
      url = url.replace(regex, String(value));
    }
  });

  // ✅ Agar query object bo'lsa, uni stringga qo'shamiz
  if (query) {
    url += queryGenerator(query);
  }

  // ✅ Debounce ishlatish (ixtiyoriy)
  const debouncedUrl = debounceTime ? useDebounces(url, debounceTime) : url;

  return useQuery<T>({
    queryKey: [debouncedUrl],
    queryFn: async () => {
      try {
        const { data } = await instanceAuth.get(debouncedUrl);
        return data;
      } catch (error) {
        console.error("Request failed:", error);
        return null;
      }
    },
    // ✅ Debounce bo'lsa, URL tayyor bo'lganda ishga tushsin
    enabled: enabled && (!debounceTime || debouncedUrl === url),
  });
};
