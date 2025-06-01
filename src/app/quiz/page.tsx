
"use client";

import type { NextPage } from 'next';
import { useState } from 'react'; // Removed useEffect as not strictly needed for this flow
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateQuiz, type QuizQuestion, type QuizGenerationInput } from '@/ai/flows/quiz-generation-flow';
import { Lightbulb, Puzzle, MessageSquare, CheckCircle, XCircle, Loader2, BookOpen, Brain, ChevronRight, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

interface QuizTopic {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string; // For icon and accent color
}

const quizTopics: QuizTopic[] = [
  { id: 'general_knowledge', name: 'General Knowledge', icon: Lightbulb, description: 'Test your knowledge across various domains.', color: 'text-yellow-400' },
  { id: 'logic_puzzles', name: 'Logic Puzzles', icon: Puzzle, description: 'Challenge your critical thinking and problem-solving.', color: 'text-blue-400' },
  { id: 'verbal_reasoning', name: 'Verbal Reasoning', icon: MessageSquare, description: 'Assess your ability to analyze written info.', color: 'text-green-400' },
  { id: 'career_aptitude', name: 'Career Aptitude', icon: Brain, description: 'Explore skills relevant to different careers.', color: 'text-purple-400' },
];

const QuizPage: NextPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'topic_selection' | 'loading' | 'in_progress' | 'completed'>('topic_selection');
  const [error, setError] = useState<string | null>(null);

  const cardBaseClass = "bg-card/50 backdrop-blur-md border border-white/10 shadow-glass-light card-glass-hover rounded-2xl";
  const buttonBaseClass = "btn-glass rounded-xl text-base py-3";


  const startQuiz = async (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setQuizState('loading');
    setError(null);
    setQuestions([]);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setScore(0);

    try {
      const input: QuizGenerationInput = { topic: topic.name, numberOfQuestions: 5, difficulty: 'medium' };
      const generatedQuiz = await generateQuiz(input);
      if (generatedQuiz.questions && generatedQuiz.questions.length > 0) {
        setQuestions(generatedQuiz.questions);
        setSelectedAnswers(new Array(generatedQuiz.questions.length).fill(null));
        setQuizState('in_progress');
      } else {
        setError('Failed to generate quiz questions. The AI might be busy or the topic too niche. Please try another topic or try again later.');
        setQuizState('topic_selection');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('An error occurred while generating the quiz. Please check your connection and try again.');
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
    setQuizState('topic_selection');
    setError(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <Loader2 className={`h-16 w-16 animate-spin ${selectedTopic?.color || 'text-primary'} mb-6`} />
        <p className="text-2xl text-foreground/90 font-semibold">Generating your {selectedTopic?.name} quiz...</p>
        <p className="text-muted-foreground mt-2">Hang tight, the AI is thinking!</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className={`${cardBaseClass} max-w-lg mx-auto text-center p-8`}>
        <Alert variant="destructive" className="mb-6 bg-destructive/20 border-destructive/50 rounded-lg">
          <XCircle className="h-6 w-6 text-destructive" />
          <AlertTitle className="text-xl text-destructive font-semibold mt-1">Oops! Something went wrong.</AlertTitle>
          <AlertDescription className="text-destructive/80 mt-2">{error}</AlertDescription>
        </Alert>
        <Button onClick={resetQuiz} variant="outline" className={`${buttonBaseClass} border-primary text-primary hover:bg-primary/10 w-full`}>
          <RotateCcw className="mr-2 h-5 w-5"/> Try Again or New Topic
        </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {quizState === 'topic_selection' && (
        <>
          <Card className={`${cardBaseClass} mb-10 text-center`}>
            <CardHeader className="p-8">
              <CardTitle className="text-4xl font-headline text-primary flex items-center justify-center">
                <BookOpen className="mr-4 h-10 w-10" />
                Choose Your Challenge
              </CardTitle>
              <CardDescription className="text-xl text-foreground/80 mt-3">
                Select a category to ignite your curiosity and test your skills.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 gap-8">
            {quizTopics.map((topic) => (
              <Card 
                key={topic.id} 
                className={`${cardBaseClass} cursor-pointer group p-2`}
                onClick={() => startQuiz(topic)}
              >
                <CardHeader className="flex flex-row items-center gap-5 p-6">
                  <topic.icon className={`h-12 w-12 ${topic.color} transition-transform duration-300 group-hover:scale-110`} />
                  <div>
                    <CardTitle className="text-2xl font-semibold group-hover:text-primary transition-colors">{topic.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">{topic.description}</CardDescription>
                  </div>
                </CardHeader>
                 <CardContent className="p-6 pt-0 text-right">
                    <Button variant="ghost" className={`text-primary hover:bg-primary/10 p-2 rounded-full ${buttonBaseClass}`}>
                        Start Quiz <ChevronRight className="ml-1 h-5 w-5"/>
                    </Button>
                 </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {quizState === 'in_progress' && currentQuestion && selectedTopic && (
        <Card className={`${cardBaseClass} max-w-2xl mx-auto`}>
          <CardHeader className="p-6">
            <div className="flex justify-between items-center mb-2">
                <CardTitle className={`text-3xl font-semibold ${selectedTopic.color} flex items-center`}>
                    <selectedTopic.icon className="mr-3 h-8 w-8" /> {selectedTopic.name} Quiz
                </CardTitle>
                <span className="text-sm font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </span>
            </div>
            <Progress value={progressPercentage} className="w-full mt-3 h-3 rounded-full bg-muted/50 [&>div]:bg-primary" />
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <p className="text-xl font-medium text-foreground/90 min-h-[60px]">{currentQuestion.questionText}</p>
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ''}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <Label 
                  key={index} 
                  htmlFor={`option-${index}`} 
                  className={cn(
                    "flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ease-in-out hover:border-primary/70",
                    selectedAnswers[currentQuestionIndex] === option ? 'bg-primary/20 border-primary shadow-md scale-[1.02]' : 'border-white/20 hover:bg-white/5',
                    "has-[:checked]:bg-primary/20 has-[:checked]:border-primary has-[:checked]:shadow-md has-[:checked]:scale-[1.02]"
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="border-primary/50 text-primary focus:ring-primary" />
                  <span className="flex-1 text-base text-foreground/80">{option}</span>
                </Label>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedAnswers[currentQuestionIndex]}
              className={`${buttonBaseClass} w-full bg-primary hover:bg-primary/80 text-primary-foreground text-lg py-7`}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      )}

      {quizState === 'completed' && selectedTopic && (
        <Card className={`${cardBaseClass} max-w-lg mx-auto text-center`}>
          <CardHeader className="p-8">
            <CardTitle className="text-4xl font-headline text-primary">Quiz Completed!</CardTitle>
            <CardDescription className={`text-xl mt-2 ${selectedTopic.color}`}>You finished the {selectedTopic.name} quiz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div className="text-7xl font-bold text-accent p-4 bg-accent/10 rounded-full inline-block">
              {score} <span className="text-4xl text-muted-foreground">/ {questions.length}</span>
            </div>
            <p className="text-2xl text-foreground/90">
              You answered {score} out of {questions.length} questions correctly.
            </p>
            <Separator className="my-6 bg-border/30" />
            <div className="space-y-3 max-h-60 overflow-y-auto p-1">
              {questions.map((q, index) => (
                <div key={index} className="p-4 border border-white/10 rounded-lg text-left bg-white/5">
                  <p className="font-medium text-foreground/80">{index + 1}. {q.questionText}</p>
                  <p className={`text-sm mt-1 ${selectedAnswers[index] === q.options[q.correctAnswerIndex] ? 'text-green-400' : 'text-red-400'}`}>
                    Your answer: {selectedAnswers[index] || 'Not answered'} 
                    {selectedAnswers[index] === q.options[q.correctAnswerIndex] 
                      ? <CheckCircle className="inline ml-2 h-5 w-5" /> 
                      : <XCircle className="inline ml-2 h-5 w-5" />}
                  </p>
                  {selectedAnswers[index] !== q.options[q.correctAnswerIndex] && (
                    <p className="text-sm text-blue-400 mt-1">Correct answer: {q.options[q.correctAnswerIndex]}</p>
                  )}
                  {q.explanation && <p className="text-xs text-muted-foreground mt-1 italic">{q.explanation}</p>}
                </div>
              ))}
            </div>
             <Separator className="my-6 bg-border/30" />
            <Button onClick={resetQuiz} className={`${buttonBaseClass} w-full bg-primary hover:bg-primary/80 text-primary-foreground text-lg py-7`}>
              <RotateCcw className="mr-2 h-5 w-5"/> Take Another Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizPage;
