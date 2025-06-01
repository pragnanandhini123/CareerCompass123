
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
    <div className="flex min-h-screen w-full"> {/* Global background is on body */}
      <SidebarNav />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 sm:px-6 glass-header">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-foreground hover:bg-foreground/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-72 glass-sidebar border-r-0">
                <SheetHeader className="flex h-16 items-center border-b px-6 shrink-0 border-sidebar-border/50">
                  <SheetTitle>
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                      <Compass className="h-8 w-8 text-sidebar-primary" />
                      <span className="font-headline text-2xl text-sidebar-primary">Career Compass</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                  {/* Pass a prop to SidebarNav if mobile-specific styling is needed inside it */}
                  <SidebarNav />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex-1">
             <AppHeader />
          </div>
        </header>

        {/* Page Content - transparent to let body background through */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
