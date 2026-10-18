"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllAppointments } from "@/services/appointment.services";
import { Calendar, Eye, Filter, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface AdminAppointment {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  patient?: {
    name: string;
    email: string;
  };
  doctor?: {
    name: string;
    designation?: string;
  };
  schedule?: {
    startDateTime: string;
    endDateTime: string;
  };
}

const AppointmentsManagementPage = () => {
  const [selectedApt, setSelectedApt] = useState<AdminAppointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["all-appointments"],
    queryFn: async () => {
      return await getAllAppointments();
    }
  });

  const appointments = (res?.data as AdminAppointment[]) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "INPROGRESS":
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-amber-600">Scheduled</Badge>;
      case "CANCELED":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (apt: AdminAppointment) => {
    setSelectedApt(apt);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments Management</h1>
          <p className="text-muted-foreground">
            Monitor, filter, and manage patient appointments across all hospital departments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Hospital Appointments</CardTitle>
              <CardDescription>
                Total records: {appointments.length} appointments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search patient or doctor..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Failed to load appointments.</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{apt.patient?.name || "Patient"}</p>
                            <p className="text-xs text-muted-foreground">{apt.patient?.email || ""}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">Dr. {apt.doctor?.name || "Doctor"}</p>
                          <p className="text-xs text-muted-foreground">{apt.doctor?.designation || "General Practitioner"}</p>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {apt.schedule?.startDateTime
                                ? new Date(apt.schedule.startDateTime).toLocaleDateString()
                                : new Date(apt.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(apt.status)}</TableCell>
                        <TableCell>
                          <Badge variant={apt.paymentStatus === "PAID" ? "default" : "secondary"}>
                            {apt.paymentStatus || "UNPAID"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleView(apt)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No appointments found in the system.
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
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Details for the selected appointment.
            </DialogDescription>
          </DialogHeader>
          {selectedApt && (
            <div className="space-y-4">
              <div>
                <strong className="text-sm">Patient Name:</strong>
                <p className="text-muted-foreground">{selectedApt.patient?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Doctor Name:</strong>
                <p className="text-muted-foreground">{selectedApt.doctor?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Date & Time:</strong>
                <p className="text-muted-foreground">
                  {selectedApt.schedule?.startDateTime
                    ? new Date(selectedApt.schedule.startDateTime).toLocaleString()
                    : new Date(selectedApt.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <strong className="text-sm">Status:</strong>
                <div className="mt-1">{getStatusBadge(selectedApt.status)}</div>
              </div>
              <div>
                <strong className="text-sm">Payment Status:</strong>
                <div className="mt-1">
                  <Badge variant={selectedApt.paymentStatus === "PAID" ? "default" : "secondary"}>
                    {selectedApt.paymentStatus || "UNPAID"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsManagementPage;