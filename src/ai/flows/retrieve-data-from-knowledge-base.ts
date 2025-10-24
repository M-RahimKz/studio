'use server';
/**
 * @fileOverview A data retrieval AI agent that retrieves data from either a custom knowledge base or the LLM's general knowledge.
 *
 * - retrieveData - A function that handles the data retrieval process.
 * - RetrieveDataInput - The input type for the retrieveData function.
 * - RetrieveDataOutput - The return type for the retrieveData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveDataInputSchema = z.object({
  query: z.string().describe('The user query to retrieve data for.'),
  useCustomKnowledgeBase: z
    .boolean()
    .describe(
      'Whether to retrieve data from the custom knowledge base or the LLM\'s general knowledge.'
    ),
});
export type RetrieveDataInput = z.infer<typeof RetrieveDataInputSchema>;

const RetrieveDataOutputSchema = z.object({
  response: z.string().describe('The response from the data retrieval.'),
});
export type RetrieveDataOutput = z.infer<typeof RetrieveDataOutputSchema>;

export async function retrieveData(input: RetrieveDataInput): Promise<RetrieveDataOutput> {
  return retrieveDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrieveDataPrompt',
  input: {schema: RetrieveDataInputSchema},
  output: {schema: RetrieveDataOutputSchema},
  prompt: `You are a helpful chatbot that retrieves data based on the user's query.

  {{#if useCustomKnowledgeBase}}
  Retrieve data from the custom knowledge base.
  {{else}}
  Retrieve data from the LLM's general knowledge.
  {{/if}}

  Query: {{{query}}}
  `,
});

const retrieveDataFlow = ai.defineFlow(
  {
    name: 'retrieveDataFlow',
    inputSchema: RetrieveDataInputSchema,
    outputSchema: RetrieveDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
