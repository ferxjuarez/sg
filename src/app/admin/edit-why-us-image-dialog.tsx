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

interface EditWhyUsImageDialogProps {
  onImageChanged: () => void;
}

export function EditWhyUsImageDialog({ onImageChanged }: EditWhyUsImageDialogProps) {
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
      const fileExt = file.name.split('.').pop();
      const fileName = `why-us-image.${fileExt}`;
      const filePath = `public/${fileName}`;

      const storage = supabase.storage.from('site_config');

      const { error: uploadError } = await storage.upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = storage.getPublicUrl(filePath);
        
      if (!publicUrl) {
          throw new Error('Could not get public URL for the uploaded image.');
      }
      
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase
        .from('site_config')
        .update({ value: finalUrl })
        .eq('key', 'why_choose_us_image_url');
        
      if (updateError) throw updateError;

      toast({
        title: '¡Éxito!',
        description: 'La imagen ha sido actualizada.',
      });
      
      resetForm();
      setIsOpen(false);
      onImageChanged();

    } catch (error: any) {
      console.error('Error updating image:', error);
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
        <Button size="sm" variant="outline">Cambiar Imagen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Imagen de la Sección</DialogTitle>
          <DialogDescription>
            Sube una nueva imagen para la sección "Por qué elegirnos".
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
