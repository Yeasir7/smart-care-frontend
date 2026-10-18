"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Heart, Search, UserCheck, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "@/services/patient.services";

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  isDeleted: boolean;
  createdAt: string;
  patientHealthData?: {
    bloodGroup?: string;
    gender?: string;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
  } | null;
}

const PatientsManagementPage = () => {
  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getAllPatients(),
  });

  const patients = (res?.data as PatientRecord[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients Management</h1>
          <p className="text-muted-foreground">
            Search, review health profiles, and manage registered patient records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Registered Patients</p>
            <p className="text-2xl font-bold">{patients.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Active Accounts</p>
            <p className="text-2xl font-bold">{patients.filter((p) => !p.isDeleted).length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Health Data Synced</p>
            <p className="text-2xl font-bold">{patients.filter((p) => p.patientHealthData).length}</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Patients Directory</CardTitle>
              <CardDescription>
                Complete registry of patient accounts and medical contact cards.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email..." className="pl-8" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Failed to load patients.</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Registered Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{patient.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{patient.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {patient.contactNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {patient.patientHealthData?.bloodGroup?.replace("_", " ") || "Not set"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={patient.isDeleted ? "destructive" : "default"}>
                            {patient.isDeleted ? "Inactive" : "Active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No patients registered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsManagementPage;