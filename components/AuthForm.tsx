// components/AuthForm.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface AuthFormProps {
    mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                // Redirect to dashboard after signup
                router.push('/dashboard');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                // Redirect to dashboard after login
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        minLength={6}
                    />
                    {mode === 'signup' && (
                        <p className="text-sm text-slate-500 mt-1">
                            Minimum 6 characters
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
                </Button>
            </form>

            <p className="text-center mt-4 text-sm text-slate-600">
                {mode === 'signup' ? (
                    <>
                        Already have an account?{' '}
                        <a href="/login" className="text-purple-600 hover:underline">
                            Sign in
                        </a>
                    </>
                ) : (
                    <>
                        Don't have an account?{' '}
                        <a href="/signup" className="text-purple-600 hover:underline">
                            Sign up
                        </a>
                    </>
                )}
            </p>
        </Card>
    );
}