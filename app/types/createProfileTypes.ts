import { UseMutationResult } from "@tanstack/react-query";

export type CustomerPayload = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

export type AddressPayload = {
  street_address_1?: string;
  street_address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  customer_id?: string; // added later
};

export type AddressResponse = {
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
};

export type CustomerResponse = {
  first_name: string;
  last_name: string;
  phone_number: string;
  id: string;
  supabase_user_id: string;
  created_at: string;
  updated_at: string;
};

export type GenerateButtonAndErrorTextType = {
  customerMutation: UseMutationResult<
    CustomerResponse,
    Error,
    CustomerPayload,
    unknown
  >;
  addressMutation: UseMutationResult<
    AddressResponse,
    Error,
    AddressPayload,
    unknown
  >;
};
