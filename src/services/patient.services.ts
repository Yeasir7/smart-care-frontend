"use server";


import { httpClient } from "@/lib/axios/httpClient";

export const getMyProfile = async () => {
  return await httpClient.get('/patients/me');
};
export const updateMyProfile = async (data: { contactNumber?: string; address?: string }) => {
  return await httpClient.patch('/patients/me', data);
};
export const getAllPatients = async () => {
  return await httpClient.get('/patients');
};
