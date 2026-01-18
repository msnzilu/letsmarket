// app/(auth)/login/page.tsx

import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <AuthForm mode="login" />
            </div>
        </div>
    );
}