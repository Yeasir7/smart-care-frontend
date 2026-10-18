"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart"
import AppointmentPieChart from "@/components/shared/AppointmentPieChart"
import StatsCard from "@/components/shared/StatsCard"
import { getDashboardData } from "@/services/dashboard.services"
import { ApiResponse } from "@/types/api.types"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Shield, Stethoscope, Users } from "lucide-react"
import Link from "next/link"

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  });

  const data = (adminDashboardData as ApiResponse<IAdminDashboardData> | undefined)?.data;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-primary/10 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Admin Quick Actions</CardTitle>
              <CardDescription>
                Create new healthcare practitioners, manage system administrators, and view hospital operations.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="default" className="shadow-xs">
                <Link href="/admin/dashboard/doctors-management">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Add / Manage Doctors
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-xs">
                <Link href="/admin/dashboard/admins-management">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Admins
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Appointments"
          value={data?.appointmentCount || 0}
          iconName="CalendarDays"
          description="Number of appointments scheduled"
        />
        <StatsCard
          title="Total Patients"
          value={data?.patientCount || 0}
          iconName="Users"
          description="Number of patients registered"
        />
        <StatsCard
          title="Total Doctors"
          value={data?.doctorCount || 0}
          iconName="UserCheck"
          description="Number of active doctors"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${data?.totalRevenue || 0}`}
          iconName="DollarSign"
          description="Total revenue generated"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentBarChart data={data?.barChartData || []} />
        <AppointmentPieChart data={data?.pieChartData || []} />
      </div>
    </div>
  );
}

export default AdminDashboardContent