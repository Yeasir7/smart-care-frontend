"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAllPrescriptions } from "@/services/prescription.services";
import { Calendar, Eye, FileText, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PrescriptionItem {
  id: string;
  instructions: string;
  followUpDate?: string;
  createdAt: string;
  doctor?: { name: string; designation?: string };
  patient?: { name: string; email: string };
  appointment?: { id: string };
}

const PrescriptionsManagementPage = () => {
  const [selectedRx, setSelectedRx] = useState<PrescriptionItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      return await getAllPrescriptions();
    }
  });

  const prescriptions = (res?.data as PrescriptionItem[]) || [];

  const handleView = (rx: PrescriptionItem) => {
    setSelectedRx(rx);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions Management</h1>
          <p className="text-muted-foreground">
            Central repository of digital prescriptions issued by hospital doctors.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Prescription Registry
              </CardTitle>
              <CardDescription>
                Search and inspect medical prescriptions and medication instructions.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient or doctor..." className="pl-8" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Failed to load prescriptions.</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Instructions</TableHead>
                    <TableHead>Follow-up Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.length > 0 ? (
                    prescriptions.map((rx) => (
                      <TableRow key={rx.id}>
                        <TableCell className="font-medium text-sm">
                          {rx.patient?.name || "Patient"}
                        </TableCell>
                        <TableCell className="text-sm">
                          Dr. {rx.doctor?.name || "Doctor"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(rx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {rx.instructions || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {rx.followUpDate ? new Date(rx.followUpDate).toLocaleDateString() : "None"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleView(rx)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No prescriptions recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Detailed view of the prescription instructions.
            </DialogDescription>
          </DialogHeader>
          {selectedRx && (
            <div className="space-y-4">
              <div>
                <strong className="text-sm">Patient Name:</strong>
                <p className="text-muted-foreground">{selectedRx.patient?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Doctor Name:</strong>
                <p className="text-muted-foreground">{selectedRx.doctor?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Issued Date:</strong>
                <p className="text-muted-foreground">
                  {new Date(selectedRx.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <strong className="text-sm">Follow-up Date:</strong>
                <p className="text-muted-foreground">
                  {selectedRx.followUpDate ? new Date(selectedRx.followUpDate).toLocaleString() : "None"}
                </p>
              </div>
              <div>
                <strong className="text-sm">Instructions:</strong>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {selectedRx.instructions || "No instructions provided."}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionsManagementPage;