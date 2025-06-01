
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { FileText, BrainCircuit, UserCheck, Lightbulb } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Progress value={50} className="w-1/2 mb-4" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect, but good for safety
    return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src="https://placehold.co/1200x400.png" 
            alt="Abstract career path" 
            layout="fill"
            objectFit="cover"
            data-ai-hint="abstract future"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
          <CardHeader className="absolute bottom-0 left-0 p-6">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary-foreground">Welcome, {user.displayName || user.email}!</CardTitle>
            <CardDescription className="text-lg text-primary-foreground/90">Your Career Compass Dashboard</CardDescription>
          </CardHeader>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" />My Quizzes</CardTitle>
            <CardDescription>View and retake your interest quizzes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't completed any quizzes yet.</p>
            <Button onClick={() => router.push('/quiz')} className="transition-transform hover:scale-105">
              <Lightbulb className="mr-2 h-5 w-5" /> Start a Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-6 w-6 text-primary" />Career Predictions</CardTitle>
            <CardDescription>Discover AI-powered career suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground mb-4">No predictions available yet. Complete a quiz first!</p>
            <Button onClick={() => router.push('/career-prediction')} variant="secondary" className="transition-transform hover:scale-105">
              <BrainCircuit className="mr-2 h-5 w-5" /> View Predictions
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center"><UserCheck className="mr-2 h-6 w-6 text-primary" />Personalized Guidance</CardTitle>
            <CardDescription>Get tailored advice for your career path.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Guidance will appear here once available.</p>
            <Button onClick={() => router.push('/personalized-guidance')} variant="outline" className="transition-transform hover:scale-105">
              <UserCheck className="mr-2 h-5 w-5" /> Get Guidance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
