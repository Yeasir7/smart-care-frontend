"use server";


import { httpClient } from "@/lib/axios/httpClient";

export const createReview = async (data: { appointmentId: string; rating: number; comment?: string }) => {
  return await httpClient.post('/reviews', data);
};
export const getMyReviews = async () => {
  return await httpClient.get('/reviews/my-reviews');
};
export const getDoctorReviews = async (doctorId: string) => {
  return await httpClient.get(`/reviews/doctor/${doctorId}`);
};
export const getAllReviews = async () => {
  return await httpClient.get('/reviews');
};
export const deleteReview = async (id: string) => {
  return await httpClient.delete(`/reviews/${id}`);
};
