// src/ai/flows/extract-grocery-data.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to extract grocery item names and prices from a receipt image.
 *
 * - extractGroceryData - A function that takes a receipt image and returns a list of grocery items and prices.
 * - ExtractGroceryDataInput - The input type for the extractGroceryData function.
 * - ExtractGroceryDataOutput - The return type for the extractGroceryData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractGroceryDataInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a grocery receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractGroceryDataInput = z.infer<typeof ExtractGroceryDataInputSchema>;

const ExtractGroceryDataOutputSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().describe('The name of the grocery item.'),
      price: z.number().describe('The price of the grocery item.'),
    })
  ).describe('A list of grocery items and their prices extracted from the receipt.'),
});
export type ExtractGroceryDataOutput = z.infer<typeof ExtractGroceryDataOutputSchema>;

export async function extractGroceryData(input: ExtractGroceryDataInput): Promise<ExtractGroceryDataOutput> {
  return extractGroceryDataFlow(input);
}

const extractGroceryDataPrompt = ai.definePrompt({
  name: 'extractGroceryDataPrompt',
  input: {schema: ExtractGroceryDataInputSchema},
  output: {schema: ExtractGroceryDataOutputSchema},
  prompt: `You are an AI assistant specialized in extracting data from grocery receipts.
  Given an image of a grocery receipt, extract the names of the items purchased and their corresponding prices.
  Return the data in a structured JSON format as described in the output schema.

  Receipt Image: {{media url=receiptDataUri}}
  `,
});

const extractGroceryDataFlow = ai.defineFlow(
  {
    name: 'extractGroceryDataFlow',
    inputSchema: ExtractGroceryDataInputSchema,
    outputSchema: ExtractGroceryDataOutputSchema,
  },
  async input => {
    const {output} = await extractGroceryDataPrompt(input);
    return output!;
  }
);
