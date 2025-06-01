
"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateQuiz, type QuizQuestion, type QuizGenerationInput } from '@/ai/flows/quiz-generation-flow';
import { Lightbulb, Puzzle, MessageSquare, CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

interface QuizTopic {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const quizTopics: QuizTopic[] = [
  { id: 'general_knowledge', name: 'General Knowledge', icon: Lightbulb, description: 'Test your knowledge across various domains.' },
  { id: 'logic_puzzles', name: 'Logic Puzzles', icon: Puzzle, description: 'Challenge your critical thinking and problem-solving skills.' },
  { id: 'verbal_reasoning', name: 'Verbal Reasoning', icon: MessageSquare, description: 'Assess your ability to understand and analyze written information.' },
];

const QuizPage: NextPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'topic_selection' | 'loading' | 'in_progress' | 'completed'>('topic_selection');
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setQuizState('loading');
    setError(null);
    setQuestions([]);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setScore(0);

    try {
      const input: QuizGenerationInput = { topic: topic.name, numberOfQuestions: 5 };
      const generatedQuiz = await generateQuiz(input);
      if (generatedQuiz.questions && generatedQuiz.questions.length > 0) {
        setQuestions(generatedQuiz.questions);
        setSelectedAnswers(new Array(generatedQuiz.questions.length).fill(null));
        setQuizState('in_progress');
      } else {
        setError('Failed to generate quiz questions. Please try another topic or try again later.');
        setQuizState('topic_selection');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('An error occurred while generating the quiz. Please try again.');
      setQuizState('topic_selection');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setQuizState('completed');
    }
  };

  const calculateScore = () => {
    let currentScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.options[q.correctAnswerIndex]) {
        currentScore++;
      }
    });
    setScore(currentScore);
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setQuizState('topic_selection');
    setError(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Generating your {selectedTopic?.name} quiz...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={resetQuiz} variant="outline">
          Back to Topic Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {quizState === 'topic_selection' && (
        <>
          <Card className="mb-8 shadow-lg border-primary border-2">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-primary flex items-center">
                <BookOpen className="mr-3 h-8 w-8" />
                Select a Quiz Topic
              </CardTitle>
              <CardDescription className="text-lg">
                Choose a category to test your knowledge or challenge your skills.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTopics.map((topic) => (
              <Card 
                key={topic.id} 
                className="shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => startQuiz(topic)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <topic.icon className="h-10 w-10 text-accent" />
                  <div>
                    <CardTitle className="text-xl">{topic.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {quizState === 'in_progress' && currentQuestion && selectedTopic && (
        <Card className="max-w-2xl mx-auto shadow-xl border-accent border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-accent flex items-center">
                <selectedTopic.icon className="mr-2 h-7 w-7" /> {selectedTopic.name} Quiz
            </CardTitle>
            <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
            <Progress value={progressPercentage} className="w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium">{currentQuestion.questionText}</p>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ''}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="w-full transition-transform hover:scale-105"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </CardContent>
        </Card>
      )}

      {quizState === 'completed' && selectedTopic && (
        <Card className="max-w-md mx-auto shadow-xl text-center border-primary border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Quiz Completed!</CardTitle>
            <CardDescription className="text-lg">You finished the {selectedTopic.name} quiz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-accent">
              {score} / {questions.length}
            </div>
            <p className="text-xl">
              You answered {score} out of {questions.length} questions correctly.
            </p>
            <Separator className="my-4" />
            <div className="space-y-2">
              {questions.map((q, index) => (
                <div key={index} className="p-3 border rounded-md text-left">
                  <p className="font-medium">{index + 1}. {q.questionText}</p>
                  <p className={`text-sm ${selectedAnswers[index] === q.options[q.correctAnswerIndex] ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {selectedAnswers[index] || 'Not answered'} 
                    {selectedAnswers[index] === q.options[q.correctAnswerIndex] 
                      ? <CheckCircle className="inline ml-1 h-4 w-4" /> 
                      : <XCircle className="inline ml-1 h-4 w-4" />}
                  </p>
                  {selectedAnswers[index] !== q.options[q.correctAnswerIndex] && (
                    <p className="text-sm text-blue-600">Correct answer: {q.options[q.correctAnswerIndex]}</p>
                  )}
                </div>
              ))}
            </div>
             <Separator className="my-4" />
            <Button onClick={resetQuiz} className="w-full transition-transform hover:scale-105">
              Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizPage;

