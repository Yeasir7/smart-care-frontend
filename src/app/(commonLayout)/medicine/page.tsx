import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Package, Pill, Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

const medicines = [
  {
    name: "Paracetamol 500mg",
    generic: "Acetaminophen",
    category: "Pain Relief & Fever",
    price: "$4.50",
    prescriptionRequired: false,
    rating: 4.8,
  },
  {
    name: "Amoxicillin 250mg",
    generic: "Amoxicillin Trihydrate",
    category: "Antibiotics",
    price: "$12.00",
    prescriptionRequired: true,
    rating: 4.9,
  },
  {
    name: "Omeprazole 20mg",
    generic: "Omeprazole Delayed-Release",
    category: "Gastrointestinal",
    price: "$8.20",
    prescriptionRequired: false,
    rating: 4.7,
  },
  {
    name: "Metformin 500mg",
    generic: "Metformin Hydrochloride",
    category: "Diabetes Care",
    price: "$9.50",
    prescriptionRequired: true,
    rating: 4.9,
  },
  {
    name: "Atorvastatin 10mg",
    generic: "Atorvastatin Calcium",
    category: "Cardiovascular",
    price: "$14.80",
    prescriptionRequired: true,
    rating: 4.8,
  },
  {
    name: "Cetirizine 10mg",
    generic: "Cetirizine Hydrochloride",
    category: "Antiallergy",
    price: "$5.00",
    prescriptionRequired: false,
    rating: 4.6,
  },
];

const MedicinePage = () => {
  return (
    <div className="container mx-auto py-12 px-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-primary font-medium">Smart Pharmacy</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Order Genuine Medicines Online</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Order 100% authentic medicines and healthcare products delivered straight to your doorstep with guaranteed fast delivery.
        </p>

        <div className="flex gap-2 max-w-lg mx-auto pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search medicines, vitamins, generics..." className="pl-9" />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {medicines.map((item) => (
          <Card key={item.name} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Pill className="w-5 h-5" />
                </div>
                {item.prescriptionRequired ? (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Rx Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    OTC
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold">{item.name}</CardTitle>
              <CardDescription className="text-xs">Generic: {item.generic}</CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-xs text-muted-foreground">{item.category}</span>
                <span className="text-lg font-bold text-primary">{item.price}</span>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-3 flex gap-2">
              <Link href="/consultation" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Get Prescription
                </Button>
              </Link>
              <Link href="/consultation">
                <Button size="sm" className="text-xs">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                  Order
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-semibold text-sm">100% Genuine Medicines</h4>
            <p className="text-xs text-muted-foreground">Direct from certified pharmaceutical distributors</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
          <Truck className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-semibold text-sm">Fast Home Delivery</h4>
            <p className="text-xs text-muted-foreground">Express delivery within 2-4 hours in metro areas</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-semibold text-sm">Safe & Discreet Packaging</h4>
            <p className="text-xs text-muted-foreground">Temperature controlled sealed packaging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePage;