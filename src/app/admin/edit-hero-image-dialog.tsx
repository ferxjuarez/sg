'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditHeroImageDialogProps {
  onImageChanged: () => void;
  currentImageUrl: string | null;
}

export function EditHeroImageDialog({ onImageChanged, currentImageUrl }: EditHeroImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  const resetForm = () => {
      setFile(null);
  }

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, selecciona un archivo de imagen.',
      });
      return;
    }
    
    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      // 1. Upload new image to Supabase Storage in a specific 'config' bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-image.${fileExt}`; // Overwrite the old hero image
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site_config') // A separate bucket for site-wide images
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
         // If bucket doesn't exist, create it. This is a fallback.
        if (uploadError.message.includes('Bucket not found')) {
            const { error: createBucketError } = await supabase.storage.createBucket('site_config', { public: true });
            if (createBucketError) throw createBucketError;
            // Retry upload
            const { error: retryUploadError } = await supabase.storage.from('site_config').upload(filePath, file, { upsert: true });
            if (retryUploadError) throw retryUploadError;
        } else {
            throw uploadError;
        }
      }
      
      // 2. Get public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('site_config')
        .getPublicUrl(filePath);
        
      if (!publicUrl) {
          throw new Error('Could not get public URL for the uploaded image.');
      }
      
      // We need to add a timestamp to bust the cache
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;


      // 3. Update the URL in the database
      const { data: config, error: updateError } = await supabase
        .from('site_config')
        .update({ value: finalUrl })
        .eq('key', 'hero_image_url')
        .select()
        .single();
        
      // If there was no row to update, insert it instead.
      if (!config || updateError) {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert({ key: 'hero_image_url', value: finalUrl });

        if (insertError) throw insertError;
      }


      toast({
        title: '¡Éxito!',
        description: 'La imagen principal ha sido actualizada.',
      });
      
      resetForm();
      setIsOpen(false);
      onImageChanged();

    } catch (error: any) {
      console.error('Error updating hero image:', error);
      toast({
        variant: 'destructive',
        title: 'Error al actualizar la imagen',
        description: error.message || 'Ocurrió un problema al subir la imagen.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button>Cambiar Imagen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Imagen Principal</DialogTitle>
          <DialogDescription>
            Sube una nueva imagen para la sección principal de la página de inicio. La imagen actual será reemplazada.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-file">Nuevo Archivo de Imagen</Label>
            <Input 
              id="image-file" 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !file}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Imagen'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
