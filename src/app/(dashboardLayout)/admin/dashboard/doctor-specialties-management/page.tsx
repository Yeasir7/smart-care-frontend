import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDoctors } from "@/services/doctor.services";
import { getAllSpecialties } from "@/services/specialty.services";
import { IDoctor } from "@/types/doctor.types";
import { ISpecialty } from "@/types/specialty.types";
import { Hospital, Plus, Stethoscope } from "lucide-react";

const DoctorSpecialtiesManagementPage = async () => {
  let doctors: IDoctor[] = [];
  let specialties: ISpecialty[] = [];

  try {
    const [docRes, specRes] = await Promise.all([
      getDoctors(""),
      getAllSpecialties(),
    ]);
    if (docRes?.data && Array.isArray(docRes.data)) doctors = docRes.data;
    if (specRes?.data && Array.isArray(specRes.data)) specialties = specRes.data;
  } catch (error) {
    console.error("Failed to fetch doctors/specialties:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Specialties Mapping</h1>
          <p className="text-muted-foreground">
            Manage medical departments and associate specialist doctors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hospital className="w-5 h-5 text-primary" />
              Available Specialties
            </CardTitle>
            <CardDescription>
              {specialties.length} clinical departments active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <Badge key={spec.id} variant="secondary" className="text-xs py-1 px-2.5">
                  {spec.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5 text-primary" />
              Doctor Specialty Assignments
            </CardTitle>
            <CardDescription>
              Specialist associations configured per practitioner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specialties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-semibold">
                          Dr. {doctor.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doctor.designation}
                        </TableCell>
                        <TableCell className="text-sm">
                          {doctor.experience} yrs
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {doctor.specialties && doctor.specialties.length > 0 ? (
                              doctor.specialties.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {typeof s === "object" && s !== null && "specialty" in s
                                    ? (s as any).specialty?.title || "Specialist"
                                    : "Specialist"}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">General</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No doctor specialty records available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSpecialtiesManagementPage;