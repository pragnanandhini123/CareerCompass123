
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    // The global body style now handles the animated gradient background
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignupForm />
    </main>
  );
}
