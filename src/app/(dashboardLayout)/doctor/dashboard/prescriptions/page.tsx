"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, FileText, Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorPrescriptions } from "@/services/prescription.services";

interface DoctorPrescription {
  id: string;
  instructions: string;
  createdAt: string;
  patient?: { name: string; email: string };
  appointmentId?: string;
}

const PrescriptionsPage = () => {
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["doctor-prescriptions"],
    queryFn: getDoctorPrescriptions
  });

  const prescriptions: DoctorPrescription[] = (res?.data as DoctorPrescription[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions Issued</h1>
          <p className="text-muted-foreground">
            Create, view, and track digital prescriptions issued to your patients.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>
                Records of all medication plans issued from your consultations.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient name..." className="pl-8" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prescription ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Loading prescriptions...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Error loading prescriptions</TableCell>
                  </TableRow>
                ) : prescriptions.length > 0 ? (
                  prescriptions.map((rx) => (
                    <TableRow key={rx.id}>
                      <TableCell className="font-mono text-xs">
                        {rx.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {rx.patient?.name || "Patient"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-sm truncate">
                        {rx.instructions}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No prescriptions created yet. Write a new prescription during or after patient consultations.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionsPage;