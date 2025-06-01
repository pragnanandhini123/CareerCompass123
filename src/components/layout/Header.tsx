
"use client";

import Link from 'next/link';
import { Compass, Bell, UserCircle, Settings, LogOut, Briefcase, BarChart3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
        className: "bg-accent/80 backdrop-blur-md text-accent-foreground border-accent/30"
      });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");

  return (
    // Header itself has glass-header class from AppLayout
    <div className="flex h-full items-center"> {/* Removed redundant sticky, border, bg, shadow as they are on parent in AppLayout */}
      <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-lg font-semibold">
        <Compass className="h-8 w-8 text-primary" />
        <span className="font-headline text-2xl text-primary">Career Compass</span>
      </Link>
      
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
              <Avatar className="h-9 w-9 border-2 border-primary/50">
                {/* Placeholder for user image, update if available */}
                {/* <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="User avatar" data-ai-hint="person portrait"/> */}
                <AvatarFallback className="bg-primary/70 text-primary-foreground font-semibold">{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-popover/80 backdrop-blur-md border-white/20 shadow-glass-strong rounded-xl mt-2">
            <DropdownMenuLabel className="font-medium text-foreground/90">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
             <DropdownMenuItem className="cursor-pointer hover:bg-accent/20 rounded-md py-2">
              <UserCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/20 rounded-md py-2">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50"/>
             <DropdownMenuItem className="cursor-pointer hover:bg-accent/20 rounded-md py-2" onClick={() => router.push('/career-profiles')}>
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              <span>Career Profiles</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/20 rounded-md py-2" onClick={() => router.push('/job-market')}>
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              <span>Job Market</span>
            </DropdownMenuItem>
             <DropdownMenuItem className="cursor-pointer hover:bg-accent/20 rounded-md py-2" onClick={() => router.push('/scholarships')}>
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              <span>Scholarships</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:!bg-destructive/20 hover:!text-destructive focus:!bg-destructive/20 focus:!text-destructive rounded-md py-2 cursor-pointer">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
