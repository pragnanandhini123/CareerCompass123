
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

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: QuizGenerationInputSchema,
    outputSchema: QuizGenerationOutputSchema,
  },
  async (input) => {
    const augmentedPrompt = `
      You are an expert quiz creator and meticulous fact-checker. Your primary goal is to generate ACCURATE and engaging quizzes.
      Topic: ${input.topic}
      Number of Questions: ${input.numberOfQuestions}
      Difficulty: ${input.difficulty || 'medium'}

      Generate a quiz title and ${input.numberOfQuestions} questions based on the topic and difficulty.
      For each question:
      1. Ensure the question text is clear, unambiguous, and factually correct for the given topic and difficulty.
      2. Provide exactly 4 distinct multiple-choice options.
      3. Ensure one option is unambiguously and verifiably correct. The other options should be plausible distractors.
      4. The 'correctAnswerIndex' MUST point to the genuinely correct answer (0-based).
      5. If you provide an 'explanation', it must be accurate and clearly justify why the correct answer is indeed correct.

      Double-check all factual claims and the correctness of the answers before finalizing.
      Return the output strictly as a JSON object matching the provided schema. Do not include any preamble or explanation outside the JSON structure.
    `;

    const {output} = await ai.generate({
        prompt: augmentedPrompt,
        model: 'googleai/gemini-2.0-flash', 
        output: {
            format: 'json', 
            schema: QuizGenerationOutputSchema, 
        },
        config: {
            temperature: 0.5, // Slightly lower temperature for more factual responses
        }
    });
    
    if (!output) {
      throw new Error('AI failed to generate quiz output.');
    }
    if (!output.questions || output.questions.length === 0) {
        console.warn("AI returned no questions, attempting to generate a fallback or indicating error.");
        return { quizTitle: `Quiz for ${input.topic}`, questions: [] }; 
    }

    return output;
  }
);

