
'use client';

import Link from 'next/link';
import { Menu, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/#services', label: 'Servicios' },
  { href: '/gallery', label: 'Galería' },
  { href: '/quote', label: 'Cotización' },
];

export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2"
            onClick={() => setMenuOpen(false)}
          >
            <Car className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold sm:inline-block">
              Machado Automotive
            </span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild className="hidden md:inline-flex">
            <Link href="/quote">Obtener Cotización</Link>
          </Button>
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                href="/"
                className="mr-6 mb-6 flex items-center space-x-2"
                onClick={() => setMenuOpen(false)}
              >
                <Car className="h-6 w-6 text-primary" />
                <span className="font-headline font-bold sm:inline-block">
                  Machado Automotive
                </span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="text-foreground/80 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
