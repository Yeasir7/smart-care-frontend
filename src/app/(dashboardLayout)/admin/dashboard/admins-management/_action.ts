"use server";

import { createAdmin, deleteAdmin, ICreateAdminPayload } from "@/services/admin.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IAdminUser } from "@/services/admin.services";
import { createAdminFormZodSchema, ICreateAdminFormValues } from "@/zod/admin.validation";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const createAdminAction = async (
  values: ICreateAdminFormValues
): Promise<ApiResponse<IAdminUser> | ApiErrorResponse> => {
  const parsed = createAdminFormZodSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues?.[0]?.message || "Invalid input data",
    };
  }

  const payload: ICreateAdminPayload = {
    password: values.password,
    admin: {
      name: values.name,
      email: values.email,
      contactNumber: values.contactNumber ? values.contactNumber : undefined,
    },
    role: values.role,
  };

  try {
    const response = await createAdmin(payload);
    return response;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to create admin"),
    };
  }
};

export const deleteAdminAction = async (
  id: string
): Promise<ApiResponse<{ message: string }> | ApiErrorResponse> => {
  if (!id) {
    return {
      success: false,
      message: "Admin ID is required",
    };
  }

  try {
    const response = await deleteAdmin(id);
    return response;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete admin"),
    };
  }
};
