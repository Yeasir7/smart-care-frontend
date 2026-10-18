"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle2, Clock, Eye, FileText, Search, User, Stethoscope, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changeAppointmentStatus } from "@/services/appointment.services";
import { WritePrescriptionModal } from "@/components/modules/Doctor/Prescriptions/WritePrescriptionModal";

interface DoctorAppointment {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  patient?: {
    name: string;
    email: string;
    contactNumber?: string;
  };
  schedule?: {
    startDateTime: string;
    endDateTime: string;
  };
}

export const DoctorAppointmentsClient = ({ initialAppointments }: { initialAppointments: DoctorAppointment[] }) => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(initialAppointments);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{ id: string; patientName: string } | null>(null);

  const statusMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => changeAppointmentStatus(data.id, data.status),
    onSuccess: () => {
      toast.success("Appointment status updated");
      router.refresh();
      // Since it's a server component parent, router.refresh() will re-fetch data.
      // But we can also trigger a re-fetch if we were using useQuery. 
      // For immediate UI update before refresh completes:
      window.location.reload(); 
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    if (status === "CANCELED") {
      if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    }
    statusMutation.mutate({ id, status });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Appointments</h1>
          <p className="text-muted-foreground">
            Manage your daily chamber queue, check in arriving patients, and issue digital prescriptions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Consultation Queue</CardTitle>
              <CardDescription>
                {appointments.length} appointments booked with you
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
                  <TableHead>Patient Details</TableHead>
                  <TableHead>Scheduled Time</TableHead>
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
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>
                            {apt.schedule?.startDateTime
                              ? `${new Date(apt.schedule.startDateTime).toLocaleDateString()} at ${new Date(apt.schedule.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
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
                      <TableCell className="text-right flex items-center justify-end gap-2 flex-wrap">
                        {apt.status === "SCHEDULED" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(apt.id, "INPROGRESS")}
                              disabled={statusMutation.isPending}
                            >
                              <Stethoscope className="w-3.5 h-3.5 mr-1" />
                              Start Chamber Visit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="text-xs"
                              onClick={() => handleStatusChange(apt.id, "CANCELED")}
                              disabled={statusMutation.isPending}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {apt.status === "INPROGRESS" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                              disabled={statusMutation.isPending}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => {
                                setSelectedAppointment({
                                  id: apt.id,
                                  patientName: apt.patient?.name || "Patient"
                                });
                                setPrescriptionModalOpen(true);
                              }}
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Write Prescription
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="text-xs"
                              onClick={() => handleStatusChange(apt.id, "CANCELED")}
                              disabled={statusMutation.isPending}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {(apt.status === "COMPLETED" || apt.status === "CANCELED") && (
                          <span className="text-xs text-muted-foreground italic">No actions</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No appointments assigned to you currently.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedAppointment && (
        <WritePrescriptionModal
          appointmentId={selectedAppointment.id}
          patientName={selectedAppointment.patientName}
          open={prescriptionModalOpen}
          onOpenChange={setPrescriptionModalOpen}
        />
      )}
    </div>
  );
};
