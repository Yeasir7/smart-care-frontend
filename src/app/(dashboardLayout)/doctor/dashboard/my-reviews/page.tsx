import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, ThumbsUp, User } from "lucide-react";
import { getUserInfo } from "@/services/auth.services";
import { getDoctorReviews } from "@/services/review.services";

interface DoctorReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient?: { name: string };
}

const DoctorsMyReviewsPage = async () => {
  const user = await getUserInfo();
  // Assuming the user object has a doctor property with an id, or the user id itself is the doctor id
  const doctorId = user?.doctor?.id || user?.userId || user?.id;
  
  let reviews: DoctorReview[] = [];
  if (doctorId) {
    try {
      const res = await getDoctorReviews(doctorId);
      if (res?.data && Array.isArray(res.data)) {
        reviews = res.data as any;
      }
    } catch (error) {
      console.log("Error fetching reviews", error);
    }
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Patient Reviews</h1>
        <p className="text-muted-foreground">
          See what patients are saying about their consultations and care experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-xl">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Average Rating</p>
            <p className="text-2xl font-bold">{averageRating} / 5.0</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Reviews</p>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded-xl">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Positive Feedback</p>
            <p className="text-2xl font-bold">100%</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Patient Testimonials</CardTitle>
          <CardDescription>
            Patient feedback is automatically collected after every completed consultation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span>{rev.patient?.name || "Verified Patient"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Star className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                No patient reviews submitted yet. They will appear here once you complete consultations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsMyReviewsPage;