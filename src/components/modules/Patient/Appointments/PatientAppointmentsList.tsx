"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type IAppointment } from "@/types/appointment.types"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { AlertCircle, CalendarClock, CircleDollarSign, MapPin, Building2, Banknote } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { changeAppointmentStatus } from "@/services/appointment.services"
import { WriteReviewModal } from "../Reviews/WriteReviewModal"
import { useRouter } from "next/navigation"

interface PatientAppointmentsListProps {
  appointments: IAppointment[]
  feedbackType?: "success" | "error"
  feedbackMessage?: string
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy • hh:mm a")
}

const PatientAppointmentsList = ({
  appointments,
  feedbackType,
  feedbackMessage,
}: PatientAppointmentsListProps) => {
  const router = useRouter()
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<{ id: string; doctorName: string } | null>(null)

  const changeStatusMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => changeAppointmentStatus(data.id, data.status),
    onSuccess: () => {
      toast.success("Appointment canceled successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to cancel appointment")
    }
  })

  const handleCancel = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      changeStatusMutation.mutate({ id, status: "CANCELED" })
    }
  }

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((left, right) => {
      const leftValue = new Date(left.schedule?.startDateTime ?? left.createdAt ?? 0).getTime()
      const rightValue = new Date(right.schedule?.startDateTime ?? right.createdAt ?? 0).getTime()
      return rightValue - leftValue
    })
  }, [appointments])

  const paidCount = appointments.filter((item) => item.paymentStatus === "PAID").length
  const unpaidCount = appointments.filter((item) => item.paymentStatus !== "PAID").length


  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border bg-linear-to-r from-cyan-50 via-white to-blue-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">My Appointments</h1>
            <p className="text-sm text-muted-foreground">
              Review your upcoming and past doctor chamber appointments. Consultation fees are payable upon arrival at the doctor's chamber reception desk.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Total: {appointments.length}</Badge>
            <Badge variant="secondary">Paid: {paidCount}</Badge>
            <Badge variant="secondary">Unpaid: {unpaidCount}</Badge>
          </div>
        </div>
      </div>

      {feedbackType && feedbackMessage && (
        <Alert variant={feedbackType === "error" ? "destructive" : "default"}>
          <AlertCircle className="size-4" />
          <AlertTitle>{feedbackType === "error" ? "Payment update" : "Appointment update"}</AlertTitle>
          <AlertDescription>{feedbackMessage}</AlertDescription>
        </Alert>
      )}

      {sortedAppointments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No appointments yet</CardTitle>
            <CardDescription>
              Start by choosing a doctor and selecting an available time slot.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/consultation">Browse Doctors</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sortedAppointments.map((appointment) => {
            return (
              <Card key={appointment.id} className="gap-4">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle>{appointment.doctor?.name || "Doctor appointment"}</CardTitle>
                      <CardDescription>
                        {appointment.doctor?.designation || "Consultation"}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{appointment.status || "SCHEDULED"}</Badge>
                      <Badge variant={appointment.paymentStatus === "PAID" ? "secondary" : "outline"}>
                        {appointment.paymentStatus || "UNPAID"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
                      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <CalendarClock className="size-4 text-primary" />
                        Chamber Schedule
                      </div>
                      <p className="font-medium">{formatDateTime(appointment.schedule?.startDateTime)}</p>
                      <p className="text-muted-foreground text-xs">Ends {formatDateTime(appointment.schedule?.endDateTime)}</p>
                    </div>

                    <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
                      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                        <Banknote className="size-4 text-emerald-600" />
                        Chamber Fee
                      </div>
                      <p className="font-medium text-emerald-700">৳{appointment.doctor?.appointmentFee?.toFixed(2) ?? "0.00"}</p>
                      <p className="text-muted-foreground text-xs">Pay upon arrival at reception</p>
                    </div>
                  </div>

                  {(appointment.doctor?.currentWorkingPlace || appointment.doctor?.address) && (
                    <div className="rounded-2xl border bg-muted/10 p-3.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            {appointment.doctor?.currentWorkingPlace || "Doctor's Chamber"}
                          </p>
                          {appointment.doctor?.address && (
                            <p className="text-muted-foreground mt-0.5">{appointment.doctor.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Appointment ID: <span className="font-medium text-foreground">{appointment.id}</span>
                  </div>
                </CardContent>

                <CardFooter className="justify-between gap-3 flex-wrap">
                  <Button asChild variant="outline">
                    <Link href={`/consultation/doctor/${appointment.doctorId || appointment.doctor?.id || ""}`}>
                      View Doctor
                    </Link>
                  </Button>

                  <div className="flex gap-2">
                    {appointment.status === "SCHEDULED" && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleCancel(appointment.id)}
                        disabled={changeStatusMutation.isPending}
                      >
                        Cancel Appointment
                      </Button>
                    )}

                    {appointment.status === "COMPLETED" && (
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          setSelectedAppointment({
                            id: appointment.id,
                            doctorName: appointment.doctor?.name || "Doctor"
                          })
                          setReviewModalOpen(true)
                        }}
                      >
                        Write Review
                      </Button>
                    )}

                    {appointment.paymentStatus === "PAID" ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3 text-xs">
                        Paid at Chamber
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 py-1.5 px-3 text-xs">
                        Pay ৳{appointment.doctor?.appointmentFee?.toFixed(0) || "0"} at Chamber Desk
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {selectedAppointment && (
        <WriteReviewModal
          appointmentId={selectedAppointment.id}
          doctorName={selectedAppointment.doctorName}
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
        />
      )}
    </div>
  )
}

export default PatientAppointmentsList