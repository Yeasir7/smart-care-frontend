import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, Hospital, Landmark, Mail, MapPin, Phone, Users } from "lucide-react";
import Link from "next/link";

const ngos = [
  {
    name: "Hope for Health Foundation",
    focus: "Maternal & Child Healthcare",
    location: "Dhaka, Bangladesh",
    contact: "+880 1711 000111",
    email: "contact@hopehealth.org",
    beneficiaries: "50,000+ Patients Served",
    description: "Providing free prenatal, postnatal, and pediatric care for underprivileged communities in rural areas.",
  },
  {
    name: "Vision Care Mission",
    focus: "Eye Care & Blindness Prevention",
    location: "Chittagong, Bangladesh",
    contact: "+880 1812 222333",
    email: "info@visioncare.org",
    beneficiaries: "15,000+ Cataract Surgeries",
    description: "Organizing free eye camps, distributing corrective eyewear, and performing subsidized surgical procedures.",
  },
  {
    name: "Heart Beat Lifeline",
    focus: "Cardiac Health & Emergency Aid",
    location: "Sylhet, Bangladesh",
    contact: "+880 1913 444555",
    email: "help@heartbeatlifeline.org",
    beneficiaries: "10,000+ Critical Interventions",
    description: "Sponsoring life-saving cardiac surgeries and emergency medications for economically challenged patients.",
  },
  {
    name: "Clean Smiles Dental Outreach",
    focus: "Oral Health & Hygiene",
    location: "Rajshahi, Bangladesh",
    contact: "+880 1614 666777",
    email: "hello@cleansmiles.org",
    beneficiaries: "30,000+ School Children",
    description: "Promoting oral hygiene education, free dental screenings, and preventative care in remote primary schools.",
  },
];

const NGOsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="text-primary font-medium">Healthcare Initiatives</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Partner Non-Profit Organizations</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          We collaborate with grassroots non-profit organizations to deliver subsidized treatments, medical camps, and community outreach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ngos.map((ngo) => (
          <Card key={ngo.name} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {ngo.focus}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold">{ngo.name}</CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                {ngo.location}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ngo.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-primary font-semibold bg-primary/5 p-2.5 rounded-lg">
                <Users className="w-4 h-4" />
                <span>{ngo.beneficiaries}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{ngo.contact}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{ngo.email}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4 flex gap-3">
              <Link href="/consultation" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Request Aid Support
                </Button>
              </Link>
              <Link href="/consultation">
                <Button size="sm" className="text-xs">
                  Partner with NGO
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border text-center max-w-3xl mx-auto space-y-3">
        <h3 className="text-2xl font-bold">Are you an NGO providing healthcare?</h3>
        <p className="text-sm text-muted-foreground">
          Partner with Smart Care to get access to volunteer specialist doctors, automated health records management, and teleconsultation software.
        </p>
        <div className="pt-2">
          <Link href="/consultation">
            <Button>Apply for NGO Partnership</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NGOsPage;