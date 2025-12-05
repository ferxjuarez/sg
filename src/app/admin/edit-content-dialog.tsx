'use client';

import { useState, useEffect } from 'react';
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
import type { SiteConfig } from './page';

interface EditContentDialogProps {
  siteConfig: SiteConfig;
  onContentChanged: () => void;
}

export function EditContentDialog({ siteConfig, onContentChanged }: EditContentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(siteConfig);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    
    // Prepare updates as an array of promises
    const updatePromises = Object.keys(formData).map(key =>
      supabase
        .from('site_config')
        .update({ value: formData[key] })
        .eq('key', key)
    );

    try {
      const results = await Promise.all(updatePromises);
      const firstError = results.find(res => res.error);

      if (firstError?.error) {
        throw firstError.error;
      }

      toast({
        title: '¡Éxito!',
        description: 'El contenido de la página ha sido actualizado.',
      });
      
      setIsOpen(false);
      onContentChanged();

    } catch (error: any) {
      console.error('Error updating content:', error);
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: error.message || 'Ocurrió un problema al guardar los cambios.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar Textos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Contenido de la Página</DialogTitle>
          <DialogDescription>
            Modifica los textos principales que se muestran en tu sitio web.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          
          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Encabezado Principal</legend>
            <div className="space-y-2">
                <Label htmlFor="hero_headline">Título</Label>
                <Input id="hero_headline" name="hero_headline" value={formData.hero_headline || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hero_subheadline">Subtítulo</Label>
                <Textarea id="hero_subheadline" name="hero_subheadline" value={formData.hero_subheadline || ''} onChange={handleInputChange} rows={3} />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Sección "Por qué elegirnos"</legend>
             <div className="space-y-2">
                <Label htmlFor="why_choose_us_title">Título de la sección</Label>
                <Input id="why_choose_us_title" name="why_choose_us_title" value={formData.why_choose_us_title || ''} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="why_choose_us_text">Texto principal</Label>
                <Textarea id="why_choose_us_text" name="why_choose_us_text" value={formData.why_choose_us_text || ''} onChange={handleInputChange} rows={4} />
            </div>
          </fieldset>
          
          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Biografía del Experto</legend>
            <div className="space-y-2">
                <Label htmlFor="bio_title">Título de la biografía</Label>
                <Input id="bio_title" name="bio_title" value={formData.bio_title || ''} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="bio_subtitle">Subtítulo de la biografía</Label>
                <Input id="bio_subtitle" name="bio_subtitle" value={formData.bio_subtitle || ''} onChange={handleInputChange} />
            </div>
          </fieldset>
          
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
