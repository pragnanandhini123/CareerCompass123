"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  UserCheck,
  Briefcase,
  BarChart3,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quiz', label: 'Interest Quizzes', icon: FileText },
  { href: '/career-prediction', label: 'Career Prediction', icon: BrainCircuit },
  { href: '/personalized-guidance', label: 'Personalized Guidance', icon: UserCheck },
  { href: '/career-profiles', label: 'Career Profiles', icon: Briefcase },
  { href: '/job-market', label: 'Job Market Analysis', icon: BarChart3 },
  { href: '/scholarships', label: 'Scholarship News', icon: GraduationCap },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Compass className="h-7 w-7 text-sidebar-primary" />
          <span className="font-headline text-xl text-sidebar-primary">Career Compass</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
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