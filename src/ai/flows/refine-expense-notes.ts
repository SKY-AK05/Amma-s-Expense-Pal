
'use server';
/**
 * @fileOverview A flow that refines expense notes using AI.
 *
 * - refineExpenseNotes - A function that refines the user's expense notes.
 * - RefineExpenseNotesInput - The input type for the refineExpenseNotes function.
 * - RefineExpenseNotesOutput - The return type for the refineExpenseNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineExpenseNotesInputSchema = z.object({
  currentNotes: z
    .string()
    .describe('The current notes entered by the user for an expense.'),
});
export type RefineExpenseNotesInput = z.infer<typeof RefineExpenseNotesInputSchema>;

const RefineExpenseNotesOutputSchema = z.object({
  refinedNotes: z.string().describe('The AI-refined and elaborated version of the expense notes.'),
});
export type RefineExpenseNotesOutput = z.infer<typeof RefineExpenseNotesOutputSchema>;

export async function refineExpenseNotes(input: RefineExpenseNotesInput): Promise<RefineExpenseNotesOutput> {
  return refineExpenseNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineExpenseNotesPrompt',
  input: {schema: RefineExpenseNotesInputSchema},
  output: {schema: RefineExpenseNotesOutputSchema},
  prompt: `You are a helpful assistant. The user, "Amma," is entering notes for an expense and might need help phrasing them clearly or adding more detail.
Please refine and elaborate on the following expense notes. Make them sound natural, clear, and well-written.
If the notes are very brief, try to expand on them a little, perhaps by inferring common details or asking clarifying questions in the refined note itself if essential information is missing.
If the notes are already quite good, you can make minor improvements or affirm their clarity.

User's current notes:
{{{currentNotes}}}

Respond with the refined notes.`,
});

const refineExpenseNotesFlow = ai.defineFlow(
  {
    name: 'refineExpenseNotesFlow',
    inputSchema: RefineExpenseNotesInputSchema,
    outputSchema: RefineExpenseNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
