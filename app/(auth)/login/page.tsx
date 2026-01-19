// app/(auth)/login/page.tsx

import { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
    title: 'Login - lez Market',
    description: 'Sign in to your lez Market account to access your website analyses and campaigns.',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <AuthForm mode="login" />
            </div>
        </div>
    );
}