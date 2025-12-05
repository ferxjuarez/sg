'use server';

import { z } from 'zod';
import { Resend } from 'resend';

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
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      // IMPORTANTE: Cambia 'onboarding@resend.dev' por tu email verificado en Resend
      // por ejemplo: 'notificaciones@tu-dominio.com'
      from: 'S&G Cotizaciones <onboarding@resend.dev>',
      // IMPORTANTE: Cambia esto por el email donde quieres recibir las notificaciones
      to: ['tu-email@example.com'],
      subject: `Nueva solicitud de cotización de ${name}`,
      html: `
        <h1>Nueva Solicitud de Cotización</h1>
        <p>Has recibido una nueva solicitud a través del formulario de tu página web.</p>
        <h2>Detalles:</h2>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Email de contacto:</strong> ${email}</li>
        </ul>
        <h3>Descripción del servicio solicitado:</h3>
        <p>${description}</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error('Error al enviar el email de notificación.');
    }

    console.log('Notificación por email enviada:', data);

    return {
      message: 'Solicitud recibida exitosamente.',
    };
  } catch (error) {
    console.error('Quote/Email Error:', error);
    return {
      message:
        'No se pudo enviar la solicitud. Por favor, inténtelo de nuevo más tarde.',
      errors: { _form: ['Error del servidor al procesar la solicitud.'] },
    };
  }
}
