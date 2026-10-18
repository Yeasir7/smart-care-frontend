import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/services/auth.services";
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services";
import { Calendar, CalendarClock, CheckCircle, Clock, FileText, Star, Stethoscope, Users } from "lucide-react";
import Link from "next/link";

const DoctorsDashboard = async () => {
  const userInfo = await getUserInfo();
  const doctorName = userInfo?.name || "Doctor";

  let schedules: any[] = [];
  try {
    const scheduleRes = await getMyDoctorSchedules("");
    if (scheduleRes?.data && Array.isArray(scheduleRes.data)) {
      schedules = scheduleRes.data;
    }
  } catch (error) {
    console.log("Failed to fetch doctor schedules in dashboard:", error);
  }

  const bookedSlots = schedules.filter((s) => s.isBooked).length;
  const availableSlots = schedules.filter((s) => !s.isBooked).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">
              <Stethoscope className="w-3.5 h-3.5 mr-1" />
              Doctor Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, Dr. {doctorName}
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Manage your daily consultation schedule, review patient records, and issue digital prescriptions.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/doctor/dashboard/my-schedules">
              <Button variant="secondary" className="font-semibold shadow-sm">
                <CalendarClock className="w-4 h-4 mr-2" />
                Manage Schedules
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Booked Consultations</p>
            <p className="text-2xl font-bold">{bookedSlots}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Open Time Slots</p>
            <p className="text-2xl font-bold">{availableSlots}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Schedules</p>
            <p className="text-2xl font-bold">{schedules.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Doctor Rating</p>
            <p className="text-2xl font-bold">4.9 ★</p>
          </div>
        </Card>
      </div>

      {/* Upcoming Schedules Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Your Consultation Slots</CardTitle>
            <CardDescription>
              Upcoming time slots you have allocated for patient bookings.
            </CardDescription>
          </div>
          <Link href="/doctor/dashboard/my-schedules">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {schedules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {schedules.slice(0, 6).map((slot: any) => (
                <div
                  key={slot.scheduleId || slot.id}
                  className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 flex flex-col justify-between gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {slot.schedule?.startDateTime
                          ? new Date(slot.schedule.startDateTime).toLocaleDateString()
                          : "Today"}
                      </span>
                    </div>
                    <Badge variant={slot.isBooked ? "default" : "outline"} className="text-[10px]">
                      {slot.isBooked ? "Booked" : "Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {slot.schedule?.startDateTime
                        ? `${new Date(slot.schedule.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.schedule.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Slot Time"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <CalendarClock className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                You have not assigned any consultation time slots yet.
              </p>
              <Link href="/doctor/dashboard/my-schedules">
                <Button size="sm">Assign Schedule Slots</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsDashboard;
