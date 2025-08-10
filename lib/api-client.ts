import { useQuery, useMutation } from "@tanstack/react-query";
import supabase from "./supabase";

const API_BASE_URL = "https://maidyoulook-backend.onrender.com";

export const getAuthHeaders = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
};

export const useApiQuery = <T>(
  queryKey: string[],
  endpoint: string,
  options?: {
    refetchInterval: number;
    refetchIntervalInBackGround: boolean;
    skip: boolean;
  },
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as T;
    },
    refetchInterval: options?.refetchInterval || false,
    refetchIntervalInBackground: options?.refetchIntervalInBackGround || false,
    enabled: !options?.skip,
  });
};

export const useApiMutation = <T, V>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
) => {
  return useMutation({
    mutationFn: async (variables: V) => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(variables),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json() as T;
    },
  });
};
