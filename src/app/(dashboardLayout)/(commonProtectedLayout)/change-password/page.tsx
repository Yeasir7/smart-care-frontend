"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      if (value.newPassword !== value.confirmPassword) {
        setServerError("Passwords do not match");
        return;
      }
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/auth/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: value.oldPassword,
            newPassword: value.newPassword,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSuccess(true);
          toast.success("Password changed successfully!");
          form.reset();
        } else {
          setServerError(data.message || "Failed to change password");
        }
      } catch (error: any) {
        setServerError(error.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Enter your current password and choose a new strong password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                Your password has been updated successfully!
              </p>
            </div>
          )}

          <form
            method="POST"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="oldPassword"
              validators={{
                onChange: ({ value }) => (!value ? "Current password is required" : undefined),
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowOldPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                    >
                      {showOldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["newPassword"],
                onChange: ({ value, fieldApi }) => {
                  const newPassword = fieldApi.form.getFieldValue("newPassword");
                  return value !== newPassword ? "Passwords do not match" : undefined;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Confirm New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                />
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting}
                  pendingLabel="Updating Password..."
                  disabled={!canSubmit}
                >
                  Update Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;