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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddImageDialogProps {
  onImageAdded: () => void;
}

export function AddImageDialog({ onImageAdded }: AddImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  const resetForm = () => {
      setFile(null);
      setDescription('');
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
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      if (!publicUrl) {
          throw new Error('Could not get public URL for the uploaded image.');
      }

      // 3. Insert metadata into the database
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          description,
          image_url: publicUrl,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: '¡Éxito!',
        description: 'La imagen ha sido añadida a la galería.',
      });
      
      resetForm();
      setIsOpen(false);
      onImageAdded();

    } catch (error: any) {
      console.error('Error adding image:', error);
      toast({
        variant: 'destructive',
        title: 'Error al añadir la imagen',
        description: error.message || 'Ocurrió un problema al subir la imagen.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            resetForm();
        }
        setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button>Añadir Nueva Imagen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Imagen a la Galería</DialogTitle>
          <DialogDescription>
            Sube una imagen y añade detalles sobre el trabajo realizado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-file">Archivo de Imagen</Label>
            <Input 
              id="image-file" 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Ej: Reparación de golpe en puerta de Toyota..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
