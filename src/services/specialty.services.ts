"use server";


import { httpClient } from "@/lib/axios/httpClient";

export const getAllSpecialties = async () => {
  return await httpClient.get('/specialties');
};
export const createSpecialty = async (data: FormData) => {
  return await httpClient.post('/specialties', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteSpecialty = async (id: string) => {
  return await httpClient.delete(`/specialties/${id}`);
};
export const updateSpecialty = async (id: string, data: FormData) => {
  return await httpClient.patch(`/specialties/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
