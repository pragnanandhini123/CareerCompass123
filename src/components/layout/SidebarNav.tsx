
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BrainCircuit,
  UserCheck,
  Briefcase,
  BarChart3,
  GraduationCap,
  Compass,
  Lightbulb,
  BookOpen, // Replaced FileText for My Quizzes
  Users, // For Personalized Guidance
  TrendingUp // For Job Market Analysis
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quiz', label: 'Interest Quizzes', icon: BookOpen }, 
  { href: '/career-prediction', label: 'Career Prediction', icon: BrainCircuit },
  { href: '/personalized-guidance', label: 'Personalized Guidance', icon: Users },
  { href: '/career-profiles', label: 'Career Profiles', icon: Briefcase },
  { href: '/job-market', label: 'Job Market Analysis', icon: TrendingUp },
  { href: '/scholarships', label: 'Scholarship News', icon: GraduationCap },
];

export function SidebarNav() {
  const pathname = usePathname();

  // Base classes for sidebar, glass effect applied via AppLayout or direct class
  const sidebarBaseClass = "hidden md:flex md:flex-col md:w-64 border-r glass-sidebar";
  // For mobile, the glass effect is on SheetContent in AppLayout.tsx
  // So, this component's root classes are simpler when rendered inside the sheet.

  return (
    // Desktop sidebar
    <aside className={cn(sidebarBaseClass, "text-sidebar-foreground")}>
      <div className="flex h-16 items-center border-b px-6 shrink-0 border-sidebar-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Compass className="h-8 w-8 text-sidebar-primary" />
          <span className="font-headline text-2xl text-sidebar-primary">Career Compass</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base text-sidebar-foreground transition-all duration-200 ease-in-out hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02]',
                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) && 
                'bg-sidebar-primary/90 text-sidebar-primary-foreground font-semibold shadow-lg scale-[1.03]'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
