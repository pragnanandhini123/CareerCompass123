// src/ai/flows/personalized-guidance.ts
'use server';
/**
 * @fileOverview Provides personalized career guidance based on user data and preferences.
 *
 * - personalizedGuidance - A function that generates personalized career guidance.
 * - PersonalizedGuidanceInput - The input type for the personalizedGuidance function.
 * - PersonalizedGuidanceOutput - The return type for the personalizedGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGuidanceInputSchema = z.object({
  careerOptions: z
    .array(z.string())
    .describe('List of potential career options for the user.'),
  socialImpactImportance: z
    .number()
    .min(1)
    .max(5)
    .describe('Importance of social impact in career choice (1-5).'),
  geographicalPreference: z
    .string()
    .describe('Preferred geographical location for work.'),
  financialGoals: z
    .string()
    .describe('Financial goals and expectations from the career.'),
  personalityTraits: z
    .string()
    .describe('Description of the users personality traits and interests'),
});
export type PersonalizedGuidanceInput = z.infer<typeof PersonalizedGuidanceInputSchema>;

const PersonalizedGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Personalized career guidance and recommendations.'),
});
export type PersonalizedGuidanceOutput = z.infer<typeof PersonalizedGuidanceOutputSchema>;

export async function personalizedGuidance(input: PersonalizedGuidanceInput): Promise<PersonalizedGuidanceOutput> {
  return personalizedGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGuidancePrompt',
  input: {schema: PersonalizedGuidanceInputSchema},
  output: {schema: PersonalizedGuidanceOutputSchema},
  prompt: `Based on the users potential career options: {{{careerOptions}}},
considering their importance of social impact (scale of 1-5): {{{socialImpactImportance}}},
their geographical preference: {{{geographicalPreference}}},
their financial goals: {{{financialGoals}}}, and
their personality traits: {{{personalityTraits}}},
generate personalized career guidance and recommendations.

Consider factors like social impact, geographical preferences, and financial goals to provide tailored advice.
What are the best career options and personalized guidance for the user? Focus on how the user can achieve their goals, and what challenges they may face.

Response:
`,
});

const personalizedGuidanceFlow = ai.defineFlow(
  {
    name: 'personalizedGuidanceFlow',
    inputSchema: PersonalizedGuidanceInputSchema,
    outputSchema: PersonalizedGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
