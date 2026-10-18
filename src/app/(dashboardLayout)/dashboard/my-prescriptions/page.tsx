"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Pill, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMyPrescriptions } from "@/services/prescription.services";

const MyPrescriptionsPage = () => {
  const { data: res, isLoading, error } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: getMyPrescriptions
  });

  const prescriptions: any[] = (res?.data as any[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
        <p className="text-muted-foreground">
          View medication instructions and download digital prescriptions issued by your doctors.
        </p>
      </div>

      {isLoading ? (
        <div>Loading prescriptions...</div>
      ) : error ? (
        <div>Error loading prescriptions</div>
      ) : prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">Dr. {rx.doctor?.name || "Doctor"}</CardTitle>
                      <CardDescription className="text-xs">
                        Issued on {new Date(rx.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Prescription #{rx.id.slice(0, 6)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-xs text-muted-foreground uppercase">Instructions:</p>
                <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-xs leading-relaxed">
                  {rx.instructions}
                </p>
                {rx.followUpDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Follow-up Date: {new Date(rx.followUpDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <Link href="/medicine">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Pill className="w-3.5 h-3.5 mr-1" />
                    Order Medicines
                  </Button>
                </Link>
                <Button size="sm" className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">No Prescriptions Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                Your medical prescriptions will be accessible here right after you consult with a specialist.
              </p>
            </div>
            <Link href="/consultation">
              <Button>
                <Stethoscope className="w-4 h-4 mr-2" />
                Find a Doctor & Book
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPrescriptionsPage;
