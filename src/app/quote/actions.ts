'use server';

import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  description: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
});

export interface QuoteState {
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function getQuote(
  prevState: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { name, email, description } = validatedFields.data;

  // En una aplicación real, aquí enviarías un correo electrónico.
  // Por ahora, solo simularemos el éxito.
  console.log('Nueva solicitud de cotización:');
  console.log('Nombre:', name);
  console.log('Email:', email);
  console.log('Descripción:', description);

  try {
    // Aquí iría la lógica para enviar el email.
    // Por ejemplo, usando Nodemailer, Resend, etc.
    return {
      message: 'Solicitud recibida exitosamente.',
    };
  } catch (error) {
    console.error('Quote Error:', error);
    return {
      message:
        'No se pudo enviar la solicitud. Por favor, inténtelo de nuevo más tarde.',
      errors: { _form: ['Error del servidor al procesar la solicitud.'] },
    };
  }
}
