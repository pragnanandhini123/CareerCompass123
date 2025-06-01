
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Mail, KeyRound, LogIn } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (firebaseError: any) {
      let specificError = 'Failed to sign in. Please try again.';
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        specificError = 'Invalid email or password.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        specificError = 'The email address is not valid.';
      } else if (firebaseError.code === 'auth/user-disabled') {
        specificError = 'This user account has been disabled.';
      } else if (firebaseError.code === 'auth/configuration-not-found') {
        specificError = 'Firebase Email/Password sign-in is not enabled. Please enable it in your Firebase project console (Authentication > Sign-in method).';
      } else if (firebaseError.code === 'auth/api-key-not-valid') {
        specificError = 'Invalid Firebase API Key. Please check your .env file and Firebase project settings.';
      }
      console.error("Firebase signin error:", firebaseError.code, firebaseError.message);
      setError(specificError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border border-white/20 shadow-glass-strong rounded-2xl">
      <CardHeader className="text-center pt-8">
        <div className="inline-flex items-center justify-center mb-4">
          <Compass className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <CardTitle className="font-headline text-4xl text-primary">Career Compass</CardTitle>
        <CardDescription className="text-foreground/90 text-base">Welcome! Chart your course to success.</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pt-2 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 glass-input border-input-border focus:border-primary transition-colors duration-300 rounded-xl h-12"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 glass-input border-input-border focus:border-primary transition-colors duration-300 rounded-xl h-12"
                disabled={loading}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive font-medium bg-destructive/20 p-2 rounded-md">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground btn-glass rounded-xl h-12 text-lg font-semibold" disabled={loading}>
            {loading ? 'Signing In...' : (<><LogIn className="mr-2 h-5 w-5" /> Sign In</>)}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm pb-8">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-accent hover:text-accent/80 hover:underline transition-colors">
            Sign up
          </Link>
        </p>
        <Link href="#" className="mt-3 text-muted-foreground hover:text-accent hover:underline transition-colors">
          Forgot password?
        </Link>
      </CardFooter>
    </Card>
  );
}
