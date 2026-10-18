"use client";

import { createAdminAction } from "@/app/(dashboardLayout)/admin/dashboard/admins-management/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminFormZodSchema, ICreateAdminFormValues } from "@/zod/admin.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const defaultValues: ICreateAdminFormValues = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  role: "ADMIN",
};

interface CreateAdminModalProps {
  onSuccess?: () => void;
}

const CreateAdminModal = ({ onSuccess }: CreateAdminModalProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAdminAction,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const result = await mutateAsync(value);

      if (!result.success) {
        toast.error(result.message || "Failed to create admin");
        return;
      }

      toast.success(result.message || "Admin created successfully");
      setOpen(false);
      form.reset();

      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      onSuccess?.();
      router.refresh();
    },
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        form.reset();
      }
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Create Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Administrator</DialogTitle>
          <DialogDescription>
            Add a new system administrator with administrative privileges.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          <form.Field
            name="name"
            validators={{ onChange: createAdminFormZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                placeholder="e.g. John Doe"
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: createAdminFormZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="admin@example.com"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: createAdminFormZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type="password"
                placeholder="Enter password (min 6 chars)"
              />
            )}
          </form.Field>

          <form.Field
            name="contactNumber"
            validators={{ onChange: createAdminFormZodSchema.shape.contactNumber }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Contact Number (Optional)"
                placeholder="e.g. +8801700000000"
              />
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="admin-role">Admin Role</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val as "ADMIN" | "SUPER_ADMIN")}
                >
                  <SelectTrigger id="admin-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating Admin..."
                  disabled={!canSubmit}
                  className="w-auto min-w-32"
                >
                  Create Admin
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;
