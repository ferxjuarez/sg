'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, ShieldAlert } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Profile = {
  role: string;
  full_name: string;
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();
      
      if (error || !profileData) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        setIsAuthorized(false);
        return;
      }

      setProfile(profileData);

      if (profileData.role === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    getUserProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
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
      <div className="flex items-center justify-between">
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

      <div className="mt-8">
        <p>
          Aquí podrás gestionar el contenido de la web. Próximamente
          agregaremos las herramientas para subir y editar las imágenes de la
          galería y administrar los servicios.
        </p>
      </div>
    </div>
  );
}
