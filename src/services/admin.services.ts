"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  createdAt: string;
  isDeleted: boolean;
  user?: {
    role: string;
    status: string;
  };
}

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
  };
  role: "ADMIN" | "SUPER_ADMIN";
}

export const getAllAdmins = async () => {
  try {
    const response = await httpClient.get<IAdminUser[]>("/admins");
    return response;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const createAdmin = async (payload: ICreateAdminPayload) => {
  try {
    const response = await httpClient.post<IAdminUser>("/users/create-admin", payload);
    return response;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    const response = await httpClient.delete<{ message: string }>(`/admins/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};
