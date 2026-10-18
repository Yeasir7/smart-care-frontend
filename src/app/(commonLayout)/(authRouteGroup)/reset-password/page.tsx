"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      email: emailFromQuery,
      otp: "",
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
        const res = await fetch(`${baseUrl}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: value.email || email,
            otp: value.otp,
            newPassword: value.newPassword,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSuccess(true);
          toast.success("Password reset successfully!");
        } else {
          setServerError(data.message || "Failed to reset password");
        }
      } catch (error: any) {
        setServerError(error.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSuccess
              ? "Your password has been changed successfully."
              : "Enter the OTP sent to your email and choose a new password."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                You can now log in with your new password.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          ) : (
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
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                      ? "Invalid email address"
                      : undefined,
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="Enter your registered email"
                  />
                )}
              </form.Field>

              <form.Field
                name="otp"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.length < 4 ? "Please enter the valid OTP" : undefined,
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="One-Time Password (OTP)"
                    type="text"
                    placeholder="Enter 6-digit OTP code"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        variant="ghost"
                        size="icon"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                    type={showPassword ? "text" : "password"}
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
                    pendingLabel="Resetting Password..."
                    disabled={!canSubmit}
                  >
                    Reset Password
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t pt-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary font-medium hover:underline underline-offset-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;