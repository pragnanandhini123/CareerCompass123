'use server';

/**
 * @fileOverview AI-powered career path prediction based on user quiz responses and profile information.
 *
 * - predictCareer - Predicts potential career paths based on user data.
 * - CareerPredictionInput - The input type for the predictCareer function.
 * - CareerPredictionOutput - The return type for the predictCareer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerPredictionInputSchema = z.object({
  quizResponses: z
    .string()
    .describe('Stringified JSON of quiz responses, including questions and answers.'),
  profileInformation: z
    .string()
    .describe('Stringified JSON of user profile information, including skills, education, and experience.'),
});
export type CareerPredictionInput = z.infer<typeof CareerPredictionInputSchema>;

const CareerPredictionOutputSchema = z.object({
  predictedCareers: z
    .array(z.string())
    .describe('An array of predicted career paths that align with the user.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the career predictions, explaining why each career is a good fit.'),
});
export type CareerPredictionOutput = z.infer<typeof CareerPredictionOutputSchema>;

export async function predictCareer(input: CareerPredictionInput): Promise<CareerPredictionOutput> {
  return predictCareerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPredictionPrompt',
  input: {schema: CareerPredictionInputSchema},
  output: {schema: CareerPredictionOutputSchema},
  prompt: `You are a career advisor. Analyze the quiz responses and profile information provided by the user to predict potential career paths that align with their interests and skills.

Quiz Responses: {{{quizResponses}}}
Profile Information: {{{profileInformation}}}

Consider the following factors when making your predictions:
* Interests and hobbies
* Skills and abilities
* Education and experience
* Personality traits

Provide a list of predicted career paths and explain your reasoning behind each prediction.

Format your response as a JSON object with the following keys:
* predictedCareers: An array of career paths.
* reasoning: An explanation of why each career is a good fit for the user.
`,
});

const predictCareerFlow = ai.defineFlow(
  {
    name: 'predictCareerFlow',
    inputSchema: CareerPredictionInputSchema,
    outputSchema: CareerPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
