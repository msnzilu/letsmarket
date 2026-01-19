// app/(auth)/signup/page.tsx

import { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: 'Sign Up - lez Market',
    description: 'Create a free lez Market account and start optimizing your website for conversions.',
};

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <AuthForm mode="signup" />
            </div>
        </div>
    );
}