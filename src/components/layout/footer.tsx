
'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../icons/logo';

export function Footer() {
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here (e.g., send an email)
    console.log('Form submitted!');
    toast({
      title: 'Mensaje Enviado',
      description:
        'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto grid max-w-screen-2xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              S&G
            </span>
          </Link>
          <p className="text-muted-foreground">
            Devolviéndole a tu vehículo su brillo y valor original.
          </p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-headline font-semibold">Navegación</h3>
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Inicio
          </Link>
          <Link
            href="/#services"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Servicios
          </Link>
          <Link
            href="/gallery"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Galería
          </Link>
          <Link
            href="/quote"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Cotización
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-headline font-semibold">Empresa</h3>
          <Link
            href="/admin"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} S&G.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
