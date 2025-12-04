'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, ShieldAlert, ImageIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type Profile = {
  role: string;
  full_name: string;
};

type GalleryImage = {
  id: string;
  description: string | null;
  image_url: string;
  image_hint: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
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
        setLoading(false);
        setIsAuthorized(false);
        return;
      }

      setProfile(profileData);

      if (profileData.role === 'admin') {
        setIsAuthorized(true);
        const { data: images, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (imagesError) {
          console.error('Error fetching gallery images:', imagesError);
        } else {
          setGalleryImages(images);
        }
      } else {
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
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
    )
  }

  return (
    <div className="container mx-auto py-16 md:py-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">Bienvenido, {profile?.full_name || user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-2'>
                <ImageIcon className="h-6 w-6" />
                <CardTitle className='font-headline text-2xl'>Gestionar Galería</CardTitle>
              </div>
              <Button disabled>Añadir Nueva Imagen</Button>
            </div>
          </CardHeader>
          <CardContent>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-md border">
                    <Image 
                      src={image.image_url} 
                      alt={image.description ?? 'Imagen de la galería'} 
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No hay imágenes en la galería.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
