"use server";


import { httpClient } from "@/lib/axios/httpClient";

export const createPrescription = async (data: { appointmentId: string; instructions?: string; followUpDate?: string }) => {
  return await httpClient.post('/prescriptions', data);
};
export const getMyPrescriptions = async () => {
  return await httpClient.get('/prescriptions/my-prescriptions');
};
export const getDoctorPrescriptions = async () => {
  return await httpClient.get('/prescriptions/doctor-prescriptions');
};
export const getAllPrescriptions = async () => {
  return await httpClient.get('/prescriptions');
};
export const getPrescriptionById = async (id: string) => {
  return await httpClient.get(`/prescriptions/${id}`);
};
