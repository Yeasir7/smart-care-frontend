"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAllPayments = async () => {
  return await httpClient.get<any[]>("/payments");
};

export const getMyPayments = async () => {
  return await httpClient.get<any[]>("/payments/my-payments");
};
