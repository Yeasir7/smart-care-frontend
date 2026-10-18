"use client";

import { deleteAdminAction } from "@/app/(dashboardLayout)/admin/dashboard/admins-management/_action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IAdminUser } from "@/services/admin.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAdminDialogProps {
  admin: IAdminUser;
  onSuccess?: () => void;
}

const DeleteAdminDialog = ({ admin, onSuccess }: DeleteAdminDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const isSuperAdmin = admin.email === "superadmin@smartcare.com" || admin.user?.role === "SUPER_ADMIN";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteAdminAction,
  });

  const handleDelete = async () => {
    if (isSuperAdmin) {
      toast.error("The seeded Super Admin account cannot be deleted.");
      return;
    }

    const result = await mutateAsync(admin.id);
    if (!result.success) {
      toast.error(result.message || "Failed to delete admin");
      return;
    }

    toast.success("Admin deleted successfully");
    setOpen(false);
    void queryClient.invalidateQueries({ queryKey: ["admins"] });
    onSuccess?.();
    router.refresh();
  };

  if (isSuperAdmin) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="text-muted-foreground opacity-40 cursor-not-allowed"
        title="Protected Super Admin"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Delete Admin"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Administrator</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong className="text-foreground">{admin.name}</strong> ({admin.email}) from administrators? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAdminDialog;
