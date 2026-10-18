import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllDoctorSchedules } from "@/services/doctorSchedule.services";
import { Calendar, CalendarClock, Clock, Search, User } from "lucide-react";

interface DoctorScheduleItem {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId?: string | null;
  doctor?: {
    name: string;
    designation?: string;
  };
  schedule?: {
    startDateTime: string;
    endDateTime: string;
  };
}

const DoctorSchedulesManagementPage = async () => {
  let schedules: DoctorScheduleItem[] = [];
  try {
    const res = await getAllDoctorSchedules();
    if (res?.data && Array.isArray(res.data)) {
      schedules = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch doctor schedules:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Schedules Management</h1>
          <p className="text-muted-foreground">
            View and manage doctor availability and consultation slots.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Allocated Doctor Time Slots
              </CardTitle>
              <CardDescription>
                Overview of booked and available doctor consultation windows.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filter by doctor name..." className="pl-8" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Booking Status</TableHead>
                  <TableHead className="text-right">Schedule ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((ds) => (
                    <TableRow key={`${ds.doctorId}-${ds.scheduleId}`}>
                      <TableCell className="font-medium">
                        <p className="font-semibold">Dr. {ds.doctor?.name || "Doctor"}</p>
                        <p className="text-xs text-muted-foreground">{ds.doctor?.designation || ""}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>
                            {ds.schedule?.startDateTime
                              ? new Date(ds.schedule.startDateTime).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>
                            {ds.schedule?.startDateTime
                              ? `${new Date(ds.schedule.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(ds.schedule.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ds.isBooked ? "default" : "secondary"}>
                          {ds.isBooked ? "Booked" : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {ds.scheduleId.slice(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No doctor schedules assigned yet.
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

export default DoctorSchedulesManagementPage;
