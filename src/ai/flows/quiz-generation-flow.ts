
'use server';
/**
 * @fileOverview Generates quiz questions based on a given topic.
 *
 * - generateQuiz - A function that creates a quiz.
 * - QuizGenerationInput - The input type for the generateQuiz function.
 * - QuizGenerationOutput - The return type for the generateQuiz function.
 * - QuizQuestion - The structure for a single quiz question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).describe('An array of possible answers (e.g., 4 options).'),
  correctAnswerIndex: z.number().describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('A brief explanation for why the correct answer is right (optional).')
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const QuizGenerationInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz (e.g., "General Knowledge", "Mathematics", "World History").'),
  numberOfQuestions: z.number().min(1).max(20).default(5).describe('The number of questions to generate for the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').optional().describe('The desired difficulty level of the quiz.'),
});
export type QuizGenerationInput = z.infer<typeof QuizGenerationInputSchema>;

const QuizGenerationOutputSchema = z.object({
  quizTitle: z.string().describe('A suitable title for the generated quiz (e.g., "Fun General Knowledge Challenge").'),
  questions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type QuizGenerationOutput = z.infer<typeof QuizGenerationOutputSchema>;

export async function generateQuiz(input: QuizGenerationInput): Promise<QuizGenerationOutput> {
  return generateQuizFlow(input);
}

// Note: The original `prompt` variable defined with `ai.definePrompt` was not being used
// in the `generateQuizFlow` function. The flow directly used `ai.generate`.
// If `ai.definePrompt` was intended, it would be structured like this:
// const prompt = ai.definePrompt({
//   name: 'quizGenerationPrompt',
//   input: {schema: QuizGenerationInputSchema},
//   output: {schema: QuizGenerationOutputSchema},
//   prompt: `You are a helpful AI assistant that generates engaging quizzes.
// Please generate a quiz based on the following parameters:

// Topic: {{{topic}}}
// Number of Questions: {{{numberOfQuestions}}}
// Difficulty: {{{difficulty}}}

// For each question, provide:
// 1.  The question text.
// 2.  Exactly 4 multiple-choice options.
// 3.  The 0-based index of the correct answer from the options.
// 4.  A brief, optional explanation for the correct answer.

// Ensure the quiz title is engaging and relevant to the topic.
// The questions should be clear, unambiguous, and appropriate for the specified difficulty level.
// Return the output strictly as a JSON object matching the provided schema. Do not include any preamble or explanation outside the JSON structure.
// `,
// });

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: QuizGenerationInputSchema,
    outputSchema: QuizGenerationOutputSchema,
  },
  async (input) => {
    // Add a system instruction to improve JSON output reliability for Gemini
    const augmentedPrompt = `
      You are an expert quiz creator.
      Topic: ${input.topic}
      Number of Questions: ${input.numberOfQuestions}
      Difficulty: ${input.difficulty || 'medium'}

      Generate a quiz title and ${input.numberOfQuestions} questions. Each question must have 4 options and a correct answer index.
      Return the output strictly as a JSON object matching the provided schema. Do not include any preamble or explanation outside the JSON structure.
    `;

    const {output} = await ai.generate({
        prompt: augmentedPrompt,
        model: 'googleai/gemini-2.0-flash', // Using a specific model known for good instruction following
        output: {
            format: 'json', // Request JSON output
            schema: QuizGenerationOutputSchema, // Ensure this schema matches the expected output structure
        },
        config: {
            temperature: 0.7, // A bit of creativity
        }
    });
    
    if (!output) {
      throw new Error('AI failed to generate quiz output.');
    }
    // Basic validation, ideally Zod would handle this if the model perfectly adheres.
    if (!output.questions || output.questions.length === 0) {
        // Attempt a retry or return a default/error state
        console.warn("AI returned no questions, attempting to generate a fallback or indicating error.");
        // Fallback or error handling
        return { quizTitle: `Quiz for ${input.topic}`, questions: [] }; // Example fallback
    }

    return output;
  }
);
