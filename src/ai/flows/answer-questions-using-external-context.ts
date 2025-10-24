'use server';
/**
 * @fileOverview An AI agent that answers questions using external context.
 *
 * - answerQuestionsUsingExternalContext - A function that answers questions using external context.
 * - AnswerQuestionsUsingExternalContextInput - The input type for the answerQuestionsUsingExternalContext function.
 * - AnswerQuestionsUsingExternalContextOutput - The return type for the answerQuestionsUsingExternalContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsUsingExternalContextInputSchema = z.object({
  query: z.string().describe('The question to answer.'),
  externalData: z.string().optional().describe('External data to use when answering the question.'),
  useExternalData: z.boolean().default(false).describe('Whether to use external data when answering the question.'),
});
export type AnswerQuestionsUsingExternalContextInput = z.infer<typeof AnswerQuestionsUsingExternalContextInputSchema>;

const AnswerQuestionsUsingExternalContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsUsingExternalContextOutput = z.infer<typeof AnswerQuestionsUsingExternalContextOutputSchema>;

export async function answerQuestionsUsingExternalContext(
  input: AnswerQuestionsUsingExternalContextInput
): Promise<AnswerQuestionsUsingExternalContextOutput> {
  return answerQuestionsUsingExternalContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsUsingExternalContextPrompt',
  input: {schema: AnswerQuestionsUsingExternalContextInputSchema},
  output: {schema: AnswerQuestionsUsingExternalContextOutputSchema},
  prompt: `You are a helpful chatbot that answers questions.

  {{#if useExternalData}}
  Use the following external data to answer the question:
  {{{externalData}}}
  {{/if}}

  Question: {{{query}}}
  Answer: `,
});

const answerQuestionsUsingExternalContextFlow = ai.defineFlow(
  {
    name: 'answerQuestionsUsingExternalContextFlow',
    inputSchema: AnswerQuestionsUsingExternalContextInputSchema,
    outputSchema: AnswerQuestionsUsingExternalContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
