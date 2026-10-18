import { redirect } from "next/navigation";

export default function PatientDashboardRootPage() {
  redirect("/dashboard/my-appointments");
}
