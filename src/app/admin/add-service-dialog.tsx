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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddServiceDialogProps {
  onServiceAdded: () => void;
}

export function AddServiceDialog({ onServiceAdded }: AddServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [iconName, setIconName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFeatures('');
    setIconName('');
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!title || !file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El título y la imagen son campos obligatorios.',
      });
      return;
    }
    
    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `service-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('services') // Using a different bucket for services
        .upload(filePath, file);

      if (uploadError) {
        // If bucket doesn't exist, create it. This is a fallback.
        if (uploadError.message.includes('Bucket not found')) {
            const { error: createBucketError } = await supabase.storage.createBucket('services', { public: true });
            if (createBucketError) throw createBucketError;
            // Retry upload
            const { error: retryUploadError } = await supabase.storage.from('services').upload(filePath, file);
            if (retryUploadError) throw retryUploadError;
        } else {
            throw uploadError;
        }
      }
      
      // 2. Get public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(filePath);

      if (!publicUrl) {
          throw new Error('Could not get public URL for the uploaded image.');
      }

      // 3. Insert metadata into the database
      const featuresArray = features.split('\n').filter(f => f.trim() !== '');
      
      const { error: insertError } = await supabase
        .from('services')
        .insert({
          title,
          description,
          image_url: publicUrl,
          icon_name: iconName,
          features: featuresArray,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: '¡Éxito!',
        description: 'El nuevo servicio ha sido añadido.',
      });
      
      resetForm();
      setIsOpen(false);
      onServiceAdded();

    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        variant: 'destructive',
        title: 'Error al añadir el servicio',
        description: error.message || 'Ocurrió un problema al crear el servicio.',
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
        <Button>Añadir Nuevo Servicio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Servicio</DialogTitle>
          <DialogDescription>
            Completa los detalles para el nuevo servicio que ofreces.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Servicio</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Pulido Cerámico" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Una breve descripción del servicio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Características (una por línea)</Label>
            <Textarea
              id="features"
              placeholder="Ej: <strong>Brillo Extremo:</strong> Acabado de espejo.&#10;Protección duradera."
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={4}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="icon-name">Ícono</Label>
             <Select onValueChange={setIconName} value={iconName}>
                <SelectTrigger id="icon-name">
                    <SelectValue placeholder="Selecciona un ícono" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Hammer">Martillo (Hammer)</SelectItem>
                    <SelectItem value="Sparkles">Brillos (Sparkles)</SelectItem>
                    <SelectItem value="Award">Medalla (Award)</SelectItem>
                    <SelectItem value="ShieldCheck">Escudo (ShieldCheck)</SelectItem>
                    <SelectItem value="Clock">Reloj (Clock)</SelectItem>
                </SelectContent>
             </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-file">Imagen del Servicio</Label>
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
          <Button onClick={handleSubmit} disabled={isSubmitting || !file || !title}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Servicio'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
