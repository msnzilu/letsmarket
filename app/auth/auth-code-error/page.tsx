// app/auth/auth-code-error/page.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OctagonX } from 'lucide-react';

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <OctagonX className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
                <p className="text-slate-600 mb-8">
                    There was a problem authenticating with your social provider. This could be due to an expired session or configuration issue.
                </p>
                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full">Back to Login</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="w-full">Go to Homepage</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
