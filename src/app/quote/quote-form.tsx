'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getQuote, type QuoteState } from './actions';
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
import { Terminal, CheckCircle, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        'Enviar Solicitud'
      )}
    </Button>
  );
}

export function QuoteForm() {
  const initialState: QuoteState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(getQuote, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.errors) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-xl">
      {state.message && !state.errors ? (
        <Card className="w-full animate-in fade-in-50 bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <CheckCircle className="h-6 w-6 text-green-500" />
              ¡Solicitud Enviada!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Gracias por contactarnos. Hemos recibido tu solicitud y nos
              pondremos en contacto contigo pronto.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Formulario de Contacto
            </CardTitle>
            <CardDescription>
              Describe el daño o el servicio que necesitas.
            </CardDescription>
          </CardHeader>
          <form ref={formRef} action={dispatch}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre"
                    required
                    aria-describedby="name-error"
                  />
                  {state.errors?.name && (
                    <p
                      id="name-error"
                      className="text-sm font-medium text-destructive"
                    >
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    aria-describedby="email-error"
                  />
                  {state.errors?.email && (
                    <p
                      id="email-error"
                      className="text-sm font-medium text-destructive"
                    >
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Servicio</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Ej: Abolladura en la puerta del conductor, pulido completo..."
                  rows={5}
                  required
                  aria-describedby="description-error"
                />
                {state.errors?.description && (
                  <p
                    id="description-error"
                    className="text-sm font-medium text-destructive"
                  >
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
      )}
    </div>
  );
}
