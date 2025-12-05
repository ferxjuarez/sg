'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, ShieldAlert, ImageIcon, Wrench, Image as ImageIconLucide, Text } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { AddImageDialog } from './add-image-dialog';
import { AddServiceDialog } from './add-service-dialog';
import { EditHeroImageDialog } from './edit-hero-image-dialog';
import { EditContentDialog } from './edit-content-dialog';
import { EditWhyUsImageDialog } from './edit-why-us-image-dialog';

type Profile = {
  role: string;
  full_name: string;
};

export type GalleryImage = {
  id: string;
  description: string | null;
  image_url: string;
};

export type Service = {
  id: string;
  title: string;
  description: string | null;
  features: string[] | null;
  image_url: string;
};

export type SiteConfig = {
  [key: string]: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchContent = useCallback(async () => {
    const supabase = createClient();
    
    // Fetch Gallery Images
    const { data: images, error: imagesError } = await supabase
      .from('gallery_images')
      .select('id, description, image_url')
      .order('created_at', { ascending: false });
    if (imagesError) console.error('Error fetching gallery images:', imagesError);
    else if (images) setGalleryImages(images);
    
    // Fetch Services
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, title, description, features, image_url')
      .order('created_at', { ascending: true });
    if (servicesError) console.error('Error fetching services:', servicesError);
    else if (servicesData) setServices(servicesData);

    // Fetch Site Config
    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('key, value');
    
    if (configError) {
        console.error('Error fetching site config:', configError);
    } else if (configData) {
        const configObject = configData.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {} as SiteConfig);
        setSiteConfig(configObject);
    }
  }, []);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        setIsAuthorized(false);
      } else {
        setProfile(profileData);
        if (profileData.role === 'admin') {
          setIsAuthorized(true);
          await fetchContent();
        } else {
          setIsAuthorized(false);
        }
      }
      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router, fetchContent]);

  const handleContentChanged = () => {
    fetchContent();
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto flex max-w-lg flex-col items-center justify-center py-24">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permisos para acceder a esta página.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-12 py-16 md:py-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, {profile?.full_name || user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Text className="h-6 w-6" />
                    <CardTitle className="font-headline text-2xl">
                    Contenido de la Página Principal
                    </CardTitle>
                </div>
                <EditContentDialog siteConfig={siteConfig} onContentChanged={handleContentChanged} />
              </div>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Encabezado Principal</Label>
                <h3 className="font-semibold">{siteConfig.hero_headline}</h3>
                <p className="text-sm text-muted-foreground">{siteConfig.hero_subheadline}</p>
              </div>
               <div>
                <Label className="text-xs uppercase text-muted-foreground">Sección "¿Por Qué Elegirnos?"</Label>
                <h3 className="font-semibold">{siteConfig.why_choose_us_title}</h3>
                <p className="text-sm text-muted-foreground">{siteConfig.why_choose_us_text}</p>
              </div>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Biografía del Experto</Label>
                <h3 className="font-semibold">{siteConfig.bio_title}</h3>
                <p className="text-sm text-muted-foreground">{siteConfig.bio_subtitle}</p>
              </div>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIconLucide className="h-6 w-6" />
                <CardTitle className="font-headline text-2xl">
                  Imágenes de la Página
                </CardTitle>
              </div>
            </div>
             <CardDescription>Gestiona las imágenes principales de tu sitio web.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Label className="font-semibold">Imagen de Portada</Label>
                    <EditHeroImageDialog onImageChanged={handleContentChanged} />
                </div>
                {siteConfig.hero_image_url ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <Image src={siteConfig.hero_image_url} alt="Imagen principal actual" fill sizes="50vw" className="object-cover" />
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground">No configurada.</p>
                )}
            </div>
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Label className="font-semibold">Imagen "Por qué elegirnos"</Label>
                     <EditWhyUsImageDialog onImageChanged={handleContentChanged} />
                </div>
                {siteConfig.why_choose_us_image_url ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <Image src={siteConfig.why_choose_us_image_url} alt="Imagen 'Por qué elegirnos' actual" fill sizes="50vw" className="object-cover" />
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground">No configurada.</p>
                )}
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-6 w-6" />
                <CardTitle className="font-headline text-2xl">
                  Gestionar Servicios
                </CardTitle>
              </div>
              <AddServiceDialog onServiceAdded={handleContentChanged} />
            </div>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {services.map((service) => (
                  <Card key={service.id}>
                      <CardContent className="p-0">
                         {service.image_url && (
                             <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src={service.image_url}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                             </div>
                         )}
                         <div className="p-4">
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                                {service.features?.map((feature, i) => <li key={i} dangerouslySetInnerHTML={{__html: feature}}/>)}
                            </ul>
                         </div>
                      </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No hay servicios definidos. ¡Añade el primero!
              </p>
            )}
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              <CardTitle className="font-headline text-2xl">
                Gestionar Galería
              </CardTitle>
            </div>
            <AddImageDialog onImageAdded={handleContentChanged} />
          </div>
        </CardHeader>
        <CardContent>
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md border"
                >
                  <Image
                    src={image.image_url}
                    alt={image.description ?? 'Imagen de la galería'}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No hay imágenes en la galería. ¡Añade la primera!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
