
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Progress } from "@/components/ui/progress";
import { Briefcase, BrainCircuit, UserCheck, Lightbulb, BookOpen, Users, LineChart } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/'); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Progress value={50} className="w-1/2 mb-4 bg-primary/30 [&>div]:bg-primary rounded-full" />
        <p className="text-lg text-foreground/80">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-foreground/80">Redirecting to login...</p>
      </div>
    )
  }

  const cardBaseClass = "bg-card/50 backdrop-blur-md border border-white/10 shadow-glass-light card-glass-hover rounded-2xl";
  const buttonBaseClass = "btn-glass rounded-xl text-base py-6";

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className={`${cardBaseClass} mb-8 text-center p-8`}>
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl font-headline text-primary">Welcome, {user.displayName || user.email}!</CardTitle>
            <CardDescription className="text-xl text-foreground/80 mt-2">Your Career Compass Dashboard</CardDescription>
          </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className={cardBaseClass}>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><BookOpen className="mr-3 h-7 w-7 text-primary" />My Quizzes</CardTitle>
            <CardDescription>Explore your interests and aptitudes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Discover quizzes tailored to your journey.</p>
            <Button onClick={() => router.push('/quiz')} className={`${buttonBaseClass} bg-primary hover:bg-primary/80 text-primary-foreground w-full`}>
              <Lightbulb className="mr-2 h-5 w-5" /> Start a Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><BrainCircuit className="mr-3 h-7 w-7 text-accent" />Career Predictions</CardTitle>
            <CardDescription>AI-powered career suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground mb-4">Complete a quiz to unlock predictions.</p>
            <Button onClick={() => router.push('/career-prediction')} variant="secondary" className={`${buttonBaseClass} bg-accent hover:bg-accent/80 text-accent-foreground w-full`}>
              <Briefcase className="mr-2 h-5 w-5" /> View Predictions
            </Button>
          </CardContent>
        </Card>

        <Card className={cardBaseClass}>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><UserCheck className="mr-3 h-7 w-7 text-primary" />Personalized Guidance</CardTitle>
            <CardDescription>Tailored advice for your unique path.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Unlock guidance after exploring careers.</p>
            <Button onClick={() => router.push('/personalized-guidance')} variant="outline" className={`${buttonBaseClass} border-primary text-primary hover:bg-primary/10 w-full`}>
              <Users className="mr-2 h-5 w-5" /> Get Guidance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
