"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, CheckCircle, Mail, Phone, Shield, User, UserCheck, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMyProfile } from "@/services/patient.services";
import { updateDoctorProfile } from "@/services/doctor.services";

export const MyProfileClient = ({ userInfo }: { userInfo: any }) => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const role = userInfo?.role || "PATIENT";
  const name = userInfo?.name || "User";
  const email = userInfo?.email || "N/A";
  const isVerified = userInfo?.emailVerified ?? true;
  const status = userInfo?.status || "ACTIVE";

  const [formData, setFormData] = useState({
    contactNumber: userInfo?.patient?.contactNumber || userInfo?.doctor?.contactNumber || "",
    address: userInfo?.patient?.address || userInfo?.doctor?.address || "",
    designation: userInfo?.doctor?.designation || "",
    appointmentFee: userInfo?.doctor?.appointmentFee || "",
    currentWorkingPlace: userInfo?.doctor?.currentWorkingPlace || "",
    bio: userInfo?.doctor?.bio || ""
  });

  const canEdit = role === "PATIENT" || role === "DOCTOR";

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (role === "PATIENT") {
        return updateMyProfile({ contactNumber: data.contactNumber, address: data.address });
      } else if (role === "DOCTOR") {
        return updateDoctorProfile({
          contactNumber: data.contactNumber,
          address: data.address,
          designation: data.designation,
          appointmentFee: Number(data.appointmentFee),
          currentWorkingPlace: data.currentWorkingPlace,
          bio: data.bio
        });
      }
      return Promise.reject("Cannot edit this role");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  });

  const handleSave = () => {
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account information and preferences.
          </p>
        </div>
        {canEdit && !isEditMode && (
          <Button onClick={() => setIsEditMode(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-2 border-primary/20">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="capitalize">
                <Shield className="w-3 h-3 mr-1" />
                {role.toLowerCase().replace("_", " ")}
              </Badge>
              <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
                <UserCheck className="w-3 h-3 mr-1" />
                {status}
              </Badge>
            </div>

            <div className="w-full border-t pt-4 space-y-2">
              <Link href="/change-password" className="w-full block">
                <Button variant="outline" className="w-full text-sm">
                  Change Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your personal information and security status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <span>Full Name</span>
                  </div>
                  <p className="text-sm font-semibold">{name}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-semibold truncate">{email}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Email Verification</span>
                  </div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {isVerified ? "Verified" : "Pending Verification"}
                  </p>
                </div>
                
                {role === "PATIENT" && (
                  <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Contact Number</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.patient?.contactNumber || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border sm:col-span-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Address</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.patient?.address || "N/A"}</p>
                    </div>
                  </>
                )}

                {role === "DOCTOR" && (
                  <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Contact Number</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.doctor?.contactNumber || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Designation</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.doctor?.designation || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Appointment Fee</span>
                      </div>
                      <p className="text-sm font-semibold">৳{userInfo?.doctor?.appointmentFee || "0"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border sm:col-span-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Current Working Place</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.doctor?.currentWorkingPlace || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border sm:col-span-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <span>Bio</span>
                      </div>
                      <p className="text-sm font-semibold">{userInfo?.doctor?.bio || "N/A"}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(role === "PATIENT" || role === "DOCTOR") && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Contact Number</label>
                      <Input
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        placeholder="e.g. 01712345678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Address</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. Dhaka, Bangladesh"
                      />
                    </div>
                  </>
                )}

                {role === "DOCTOR" && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Designation</label>
                      <Input
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Appointment Fee</label>
                      <Input
                        type="number"
                        value={formData.appointmentFee}
                        onChange={(e) => setFormData({ ...formData, appointmentFee: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Current Working Place</label>
                      <Input
                        value={formData.currentWorkingPlace}
                        onChange={(e) => setFormData({ ...formData, currentWorkingPlace: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Bio</label>
                      <Input
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditMode(false)} disabled={mutation.isPending}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
