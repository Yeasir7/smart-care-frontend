import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, Clock, FlaskConical, Heart, ShieldCheck, Stethoscope } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    title: "Basic Health Checkup",
    price: "$49",
    duration: "24 hours report",
    tests: ["Complete Blood Count (CBC)", "Fasting Blood Sugar", "Lipid Profile", "Urine Routine", "Blood Pressure & BMI"],
    popular: false,
    icon: FlaskConical,
  },
  {
    title: "Comprehensive Wellness",
    price: "$99",
    duration: "12 hours report",
    tests: ["All Basic Tests", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Vitamin D & B12", "ECG"],
    popular: true,
    icon: Activity,
  },
  {
    title: "Cardiac Care Diagnostic",
    price: "$149",
    duration: "Same day report",
    tests: ["Advanced Lipid Profile", "ECG & 2D Echo", "Troponin I", "Hs-CRP", "Consultation with Cardiologist"],
    popular: false,
    icon: Heart,
  },
  {
    title: "Senior Citizen Full Body",
    price: "$129",
    duration: "24 hours report",
    tests: ["65+ Vital Health Parameters", "Bone Mineral Density", "HbA1c & Fasting Glucose", "Kidney & Liver Health", "Doctor Follow-up"],
    popular: false,
    icon: ShieldCheck,
  },
];

const DiagnosticsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-primary font-medium">Diagnostic Services</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Accurate & Fast Lab Testing</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Book pathology tests and diagnostic health packages from certified partner laboratories with home sample collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <Card
              key={pkg.title}
              className={`flex flex-col justify-between transition-all hover:shadow-lg ${
                pkg.popular ? "border-primary shadow-md relative" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{pkg.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {pkg.duration}
                </CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ person</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Included Tests:
                </p>
                <ul className="space-y-2 text-xs">
                  {pkg.tests.map((test) => (
                    <li key={test} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Link href="/consultation" className="w-full">
                  <Button variant={pkg.popular ? "default" : "outline"} className="w-full text-xs">
                    Book Diagnostic Test
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Need a Custom Prescription Test?</h2>
        <p className="text-sm text-muted-foreground">
          Consult with our verified doctors online to receive a digital diagnostic prescription and get your tests scheduled instantly.
        </p>
        <Link href="/consultation">
          <Button className="mt-2">
            <Stethoscope className="w-4 h-4 mr-2" />
            Consult a Doctor Online
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DiagnosticsPage;