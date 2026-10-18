import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/services/auth.services";
import { Activity, AlertCircle, Droplets, Heart, Plus, Shield, Upload, Weight } from "lucide-react";

const HealthRecordsPage = async () => {
  const userInfo = await getUserInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Records & Vitals</h1>
          <p className="text-muted-foreground">
            Track your vital metrics, blood group, allergies, and diagnostic lab reports.
          </p>
        </div>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Upload Medical Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-xl">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Blood Group</p>
            <p className="text-xl font-bold">O+ (Positive)</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Blood Pressure</p>
            <p className="text-xl font-bold">120 / 80 mmHg</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded-xl">
            <Weight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Body Weight</p>
            <p className="text-xl font-bold">68 kg (BMI: 22.4)</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Pulse Rate</p>
            <p className="text-xl font-bold">72 bpm</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical History & Allergies</CardTitle>
            <CardDescription>
              Disclosed clinical conditions to assist attending doctors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between items-center text-sm">
              <span className="font-medium">Known Drug Allergies</span>
              <Badge variant="outline" className="text-green-600">None Reported</Badge>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between items-center text-sm">
              <span className="font-medium">Chronic Conditions</span>
              <Badge variant="outline" className="text-slate-600">None</Badge>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between items-center text-sm">
              <span className="font-medium">Vaccination Status</span>
              <Badge variant="secondary">Up to Date</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploaded Lab & Diagnostics Reports</CardTitle>
            <CardDescription>
              Digital records from partner pathology centers and hospital tests.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8 space-y-2">
            <Activity className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              No external diagnostic test reports uploaded yet.
            </p>
            <Button variant="outline" size="sm">
              Upload First Report (PDF / Image)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecordsPage;
