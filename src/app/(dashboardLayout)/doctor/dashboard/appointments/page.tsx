import { getMyAppointments } from "@/services/appointment.services";
import { DoctorAppointmentsClient } from "./DoctorAppointmentsClient";

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

const DoctorsAppointmentsPage = async () => {
  let appointments: DoctorAppointment[] = [];
  try {
    const res = await getMyAppointments();
    if (res?.data && Array.isArray(res.data)) {
      appointments = res.data as any;
    }
  } catch (error) {
    console.log("Doctor appointments fetch:", error);
  }

  return <DoctorAppointmentsClient initialAppointments={appointments} />;
};

export default DoctorsAppointmentsPage;