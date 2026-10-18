import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Individual Starter",
    description: "Essential preventive healthcare for single individuals.",
    price: "$19",
    period: "per month",
    badge: null,
    features: [
      "2 Free Teleconsultations / month",
      "15% Discount on all Prescriptions",
      "Free Annual Basic Diagnostic Package",
      "24/7 AI Health Assistant Access",
      "Digital Health Record Locker",
    ],
    buttonVariant: "outline" as const,
  },
  {
    name: "Family Complete",
    description: "Comprehensive coverage for up to 4 family members.",
    price: "$49",
    period: "per month",
    badge: "Most Popular",
    features: [
      "Unlimited Free Teleconsultations",
      "Priority In-Clinic Doctor Booking",
      "25% Discount on Diagnostic Tests",
      "20% Discount on Home Medicine Delivery",
      "Dedicated Family Healthcare Coordinator",
      "Free Home Sample Collection",
      "Emergency Ambulance Assistance",
    ],
    buttonVariant: "default" as const,
  },
  {
    name: "Senior Care Plus",
    description: "Specialized chronic illness & geriatric wellness management.",
    price: "$79",
    period: "per month",
    badge: "Premium",
    features: [
      "Unlimited Consultations with Specialists",
      "Monthly Routine Nurse & Vitals Check",
      "Free Quarterly Full Body Checkups",
      "Automated Medicine Refills & Delivery",
      "Direct Line to Senior Geriatric Specialist",
      "Personalized Diet & Fitness Planning",
      "VIP Hospital Assistance Support",
    ],
    buttonVariant: "outline" as const,
  },
];

const HealthPlansPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-primary font-medium">Smart Care Subscriptions</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Flexible Health Plans for Everyone</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Choose a comprehensive healthcare plan that suits your needs. Save money on doctor visits, lab tests, and prescription medicines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
              plan.badge ? "border-2 border-primary shadow-lg relative lg:-translate-y-2" : ""
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div className="h-px bg-border w-full" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Plan Highlights:
              </p>
              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <Link href="/consultation" className="w-full">
                <Button variant={plan.buttonVariant} className="w-full font-semibold">
                  Subscribe to {plan.name}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="border rounded-xl p-6 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Looking for Corporate & Enterprise Plans?</h3>
            <p className="text-xs text-muted-foreground">
              Provide premium healthcare benefits to your employees with customized group coverage.
            </p>
          </div>
        </div>
        <Link href="/consultation">
          <Button variant="outline" className="shrink-0">
            Contact Enterprise Sales
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HealthPlansPage;