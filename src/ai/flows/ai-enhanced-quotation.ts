'use server';
/**
 * @fileOverview AI-enhanced quotation flow to suggest relevant services and a more accurate initial quote based on uploaded images of vehicle damage.
 *
 * - aiEnhancedQuotation - A function that processes user-submitted images and descriptions to suggest services and an initial quote.
 * - AIEnhancedQuotationInput - The input type for the aiEnhancedQuotation function.
 * - AIEnhancedQuotationOutput - The return type for the aiEnhancedQuotation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIEnhancedQuotationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the vehicle damage, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user-provided description of the damage.'),
});
export type AIEnhancedQuotationInput = z.infer<typeof AIEnhancedQuotationInputSchema>;

const AIEnhancedQuotationOutputSchema = z.object({
  suggestedServices: z.array(z.string()).describe('A list of suggested services based on the image and description.'),
  estimatedQuote: z.string().describe('An estimated initial quote for the suggested services.'),
});
export type AIEnhancedQuotationOutput = z.infer<typeof AIEnhancedQuotationOutputSchema>;

export async function aiEnhancedQuotation(input: AIEnhancedQuotationInput): Promise<AIEnhancedQuotationOutput> {
  return aiEnhancedQuotationFlow(input);
}

const aiEnhancedQuotationPrompt = ai.definePrompt({
  name: 'aiEnhancedQuotationPrompt',
  input: {schema: AIEnhancedQuotationInputSchema},
  output: {schema: AIEnhancedQuotationOutputSchema},
  prompt: `You are an expert automotive damage assessor. Analyze the provided image and description to suggest relevant services and an estimated initial quote.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Based on the damage in the photo and the description, suggest a list of services that are relevant to repair the damage and provide an estimated initial quote.  Consider services such as "Reparación de Abolladuras" (dent repair) and "Pulido de Automóviles" (car polishing).

Ensure that the output is structured to match the AIEnhancedQuotationOutputSchema schema.`, 
});

const aiEnhancedQuotationFlow = ai.defineFlow(
  {
    name: 'aiEnhancedQuotationFlow',
    inputSchema: AIEnhancedQuotationInputSchema,
    outputSchema: AIEnhancedQuotationOutputSchema,
  },
  async input => {
    const {output} = await aiEnhancedQuotationPrompt(input);
    return output!;
  }
);
