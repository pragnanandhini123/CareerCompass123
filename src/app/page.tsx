import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    // The global body style now handles the animated gradient background
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
