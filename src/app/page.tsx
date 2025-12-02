import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Hammer, Sparkles, Award, ShieldCheck, Clock } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-background')!;
const dentRepairImage = PlaceHolderImages.find(
  (p) => p.id === 'service-dent-repair'
)!;
const polishingImage = PlaceHolderImages.find(
  (p) => p.id === 'service-polishing'
)!;
const technicianImage = PlaceHolderImages.find(
  (p) => p.id === 'technician-bio'
)!;

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <h1 className="mb-4 font-headline text-4xl font-bold drop-shadow-lg md:text-6xl lg:text-7xl">
            Machado Automotive Excellence
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg drop-shadow-md md:text-xl">
            Nos especializamos en la eliminación de abolladuras y el pulido de
            la pintura de tu automóvil para devolverle su apariencia original.
          </p>
          <Button size="lg" asChild>
            <Link href="/quote">Obtener Cotización Ahora</Link>
          </Button>
        </div>
      </section>

      <section id="services" className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-screen-xl">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Devolvemos a tu vehículo su apariencia original y preservamos su
              valor.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-accent p-3 text-accent-foreground">
                    <Hammer className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline text-2xl">
                    Reparación de Abolladuras
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                  <Image
                    src={dentRepairImage.imageUrl}
                    alt={dentRepairImage.description}
                    data-ai-hint={dentRepairImage.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mb-4 text-muted-foreground">
                  Utilizamos herramientas avanzadas y técnicas especializadas
                  para restaurar la carrocería de tu vehículo sin necesidad de
                  repintar.
                </p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Método No Invasivo:</strong> Preservamos la
                      pintura original.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Económico y Eficiente:</strong> Evita costosos
                      repintados.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Recuperación Rápida:</strong> Menos tiempo en el
                      taller.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-accent p-3 text-accent-foreground">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline text-2xl">
                    Pulido de Automóviles
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                  <Image
                    src={polishingImage.imageUrl}
                    alt={polishingImage.description}
                    data-ai-hint={polishingImage.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mb-4 text-muted-foreground">
                  Diseñado para eliminar rayones menores y devolverle el brillo
                  a la pintura de tu coche.
                </p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Restauración del Brillo:</strong> Elimina rayones
                      y desperfectos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Protección Adicional:</strong> Previene daños
                      futuros.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <strong>Mejora de la Estética:</strong> Transmite cuidado
                      y profesionalismo.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto grid max-w-screen-xl items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={technicianImage.imageUrl}
                alt={technicianImage.description}
                data-ai-hint={technicianImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={technicianImage.imageUrl} alt="Técnico" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-headline text-xl font-semibold">
                  El Experto Detrás de la Excelencia
                </h3>
                <p className="text-muted-foreground">
                  Una breve biografía del técnico.
                </p>
              </div>
            </div>
            <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="mb-6 text-muted-foreground">
              En M A C H A D O, nos comprometemos a ofrecerte un servicio de alta
              calidad con resultados excepcionales. Contamos con un equipo de
              profesionales altamente capacitados y utilizamos solo los mejores
              productos y herramientas del mercado. Confía en nosotros para
              cuidar y mejorar la apariencia de tu vehículo.
            </p>
            <Button asChild>
              <Link href="/gallery">Ver Nuestros Trabajos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
