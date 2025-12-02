
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getEnhancedQuote, type QuoteState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Terminal,
  UploadCloud,
  CheckCircle,
  List,
  FileText,
  Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analizando...
        </>
      ) : (
        'Obtener Cotización con IA'
      )}
    </Button>
  );
}

export function QuoteForm() {
  const initialState: QuoteState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(getEnhancedQuote, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    if (state.message && !state.errors) {
      formRef.current?.reset();
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [state.message, state.errors]);

  return (
    <div className="grid gap-8 lg:gap-12 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Solicitar Cotización
          </CardTitle>
          <CardDescription>
            Sube una foto del daño y descríbelo. Nuestra IA te dará una
            cotización inicial y servicios sugeridos.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={dispatch}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photo">Foto del Daño</Label>
              <div
                className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === 'Enter' && fileInputRef.current?.click()
                }
                role="button"
                tabIndex={0}
                aria-label="Subir foto del daño"
              >
                <div className="space-y-1 text-center">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Previsualización de imagen"
                      width={400}
                      height={225}
                      className="mx-auto max-h-48 w-auto rounded-md object-contain"
                    />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="flex text-sm text-muted-foreground">
                    <p className="pl-1">
                      {preview
                        ? 'Clic para cambiar la imagen'
                        : 'Sube un archivo o arrástralo aquí'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP hasta 5MB
                  </p>
                </div>
              </div>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                aria-describedby="photo-error"
              />
              {state.errors?.photo && (
                <p id="photo-error" className="text-sm font-medium text-destructive">
                  {state.errors.photo[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Daño</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Ej: Abolladura en la puerta del conductor, rayón en el parachoques trasero..."
                rows={4}
                required
                aria-describedby="description-error"
              />
              {state.errors?.description && (
                <p id="description-error" className="text-sm font-medium text-destructive">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
            {state.errors?._form && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.errors._form[0]}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="flex items-center">
        {state.result ? (
          <Card className="w-full animate-in fade-in-50 bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Resultado del Análisis
              </CardTitle>
              <CardDescription>
                Esta es una cotización inicial generada por IA. El precio final
                puede variar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <List className="h-5 w-5" />
                  Servicios Sugeridos
                </h3>
                <ul className="list-inside list-disc space-y-1 rounded-md bg-background p-3">
                  {state.result.suggestedServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <FileText className="h-5 w-5" />
                  Cotización Estimada
                </h3>
                <div className="rounded-md bg-background p-4">
                  <p className="font-headline text-2xl font-bold">
                    {state.result.estimatedQuote}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
            <p>El resultado de tu cotización aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
