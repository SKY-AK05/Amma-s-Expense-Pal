'use server';

/**
 * @fileOverview A flow that suggests expense categories based on user input.
 *
 * - suggestExpenseCategories - A function that suggests expense categories.
 * - SuggestExpenseCategoriesInput - The input type for the suggestExpenseCategories function.
 * - SuggestExpenseCategoriesOutput - The return type for the suggestExpenseCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExpenseCategoriesInputSchema = z.object({
  notes: z
    .string()
    .describe('The notes or description of the expense.'),
});
export type SuggestExpenseCategoriesInput = z.infer<typeof SuggestExpenseCategoriesInputSchema>;

const SuggestExpenseCategoriesOutputSchema = z.object({
  categories: z.array(z.string()).describe('Suggested expense categories based on the notes.'),
});
export type SuggestExpenseCategoriesOutput = z.infer<typeof SuggestExpenseCategoriesOutputSchema>;

export async function suggestExpenseCategories(input: SuggestExpenseCategoriesInput): Promise<SuggestExpenseCategoriesOutput> {
  return suggestExpenseCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExpenseCategoriesPrompt',
  input: {schema: SuggestExpenseCategoriesInputSchema},
  output: {schema: SuggestExpenseCategoriesOutputSchema},
  prompt: `Based on the following notes, suggest a few expense categories. Respond as a JSON array of strings.

Notes: {{{notes}}}`,
});

const suggestExpenseCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestExpenseCategoriesFlow',
    inputSchema: SuggestExpenseCategoriesInputSchema,
    outputSchema: SuggestExpenseCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
