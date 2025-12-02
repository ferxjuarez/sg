
'use server';

import { z } from 'zod';
import { aiEnhancedQuotation } from '@/ai/flows/ai-enhanced-quotation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const FormSchema = z.object({
  description: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  photo: z
    .any()
    .refine((file) => file?.size > 0, 'Se requiere una foto del daño.')
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      'El tamaño máximo de la imagen es 5MB.'
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.'
    ),
});

export interface QuoteState {
  message?: string;
  result?: {
    suggestedServices: string[];
    estimatedQuote: string;
  };
  errors?: {
    description?: string[];
    photo?: string[];
    _form?: string[];
  };
}

export async function getEnhancedQuote(
  prevState: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const validatedFields = FormSchema.safeParse({
    description: formData.get('description'),
    photo: formData.get('photo'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrija los campos.',
    };
  }

  const { description, photo } = validatedFields.data;

  try {
    const buffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${buffer.toString(
      'base64'
    )}`;

    const result = await aiEnhancedQuotation({
      description,
      photoDataUri,
    });

    return {
      message: 'Cotización generada exitosamente.',
      result: result,
    };
  } catch (error) {
    console.error('AI Quotation Error:', error);
    return {
      message:
        'No se pudo generar la cotización. Por favor, inténtelo de nuevo más tarde.',
      errors: { _form: ['Error del servidor al procesar la solicitud.'] },
    };
  }
}
