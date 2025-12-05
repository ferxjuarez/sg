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
import {
  Hammer,
  Sparkles,
  Award,
  ShieldCheck,
  Clock,
  LucideProps,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { ComponentType } from 'react';


// Helper to get Lucide icons dynamically
const iconMap: { [key: string]: ComponentType<LucideProps> } = {
  Hammer,
  Sparkles,
  Award,
  ShieldCheck,
  Clock,
};

const DynamicIcon = ({ name }: { name: string | null }) => {
  if (!name || !iconMap[name]) {
    return <Award className="h-8 w-8" />; // Fallback icon
  }
  const IconComponent = iconMap[name];
  return <IconComponent className="h-8 w-8" />;
};

const FeatureIcon = ({ name }: { name: string }) => {
  const iconKey = name.split(' ')[0].replace('<strong>', '');
  const IconComponent =
    iconMap[iconKey] ||
    iconMap[
      Object.keys(iconMap).find((k) =>
        k.toLowerCase().includes(iconKey.toLowerCase())
      ) ?? 'ShieldCheck'
    ];
  return <IconComponent className="mt-0.5 h-5 w-5 shrink-0 text-primary" />;
};

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch all content in parallel
  const [servicesRes, siteConfigRes] = await Promise.all([
    supabase.from('services').select('*').order('created_at'),
    supabase.from('site_config').select('key, value')
  ]);

  const { data: services } = servicesRes;
  
  const siteConfig = siteConfigRes.data?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>) ?? {};

  const heroImageUrl = siteConfig.hero_image_url ?? '/images/placeholder.jpg';
  const heroHeadline = siteConfig.hero_headline ?? 'S&G Excelencia Automotriz';
  const heroSubheadline = siteConfig.hero_subheadline ?? 'Especialistas en devolver a tu vehículo su apariencia original.';
  const whyChooseUsImageUrl = siteConfig.why_choose_us_image_url ?? '/images/placeholder.jpg';
  const whyChooseUsTitle = siteConfig.why_choose_us_title ?? '¿Por Qué Elegirnos?';
  const whyChooseUsText = siteConfig.why_choose_us_text ?? 'Comprometidos con la calidad y los resultados excepcionales.';
  const bioTitle = siteConfig.bio_title ?? 'El Experto Detrás de la Excelencia';
  const bioSubtitle = siteConfig.bio_subtitle ?? 'Una breve biografía del técnico.';


  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
        <Image
          src={heroImageUrl}
          alt="Taller de reparación de automóviles"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <h1 className="mb-4 font-headline text-4xl font-bold drop-shadow-lg md:text-6xl lg:text-7xl">
            {heroHeadline}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg drop-shadow-md md:text-xl">
            {heroSubheadline}
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
            {services?.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-accent p-3 text-accent-foreground">
                      <DynamicIcon name={service.icon_name} />
                    </div>
                    <CardTitle className="font-headline text-2xl">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {service.image_url && (
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                      <Image
                        src={service.image_url}
                        alt={service.description ?? service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <p className="mb-4 text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-foreground">
                    {service.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FeatureIcon name={feature} />
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto grid max-w-screen-xl items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={whyChooseUsImageUrl}
                alt="El técnico experto de S&G"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={whyChooseUsImageUrl} alt="Técnico" />
                <AvatarFallback>S&G</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-headline text-xl font-semibold">
                  {bioTitle}
                </h3>
                <p className="text-muted-foreground">
                  {bioSubtitle}
                </p>
              </div>
            </div>
            <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
              {whyChooseUsTitle}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {whyChooseUsText}
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
