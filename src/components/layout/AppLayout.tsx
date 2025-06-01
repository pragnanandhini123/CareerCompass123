
import type { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { Header as AppHeader } from './Header';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Compass } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar: Manages its own visibility (hidden md:flex) and width */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
          {/* Mobile Menu Trigger for SidebarNav */}
          <div className="md:hidden"> {/* Only show on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-64 bg-sidebar text-sidebar-foreground">
                {/* Mobile Sidebar Header */}
                <SheetHeader className="flex h-16 items-center border-b px-6 shrink-0">
                  <SheetTitle>
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                      <Compass className="h-7 w-7 text-sidebar-primary" />
                      <span className="font-headline text-xl text-sidebar-primary">Career Compass</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                {/* Mobile Sidebar Navigation */}
                <ScrollArea className="flex-1">
                  {/* SidebarNav component contains the navigation links */}
                  <SidebarNav />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* AppHeader component (from Header.tsx) provides the rest of the header content */}
          {/* AppHeader's own logo link is already somewhat responsive (sr-only sm:not-sr-only) */}
          <div className="flex-1"> {/* Ensures AppHeader content can take available space */}
             <AppHeader />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
