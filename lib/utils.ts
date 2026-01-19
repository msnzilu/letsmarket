// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return url.trim().replace(/\/+$/, '');
}

export function getScoreColor(score: number): string {
  if (score < 40) return 'text-red-600';
  if (score < 70) return 'text-yellow-600';
  return 'text-green-600';
}

export function getScoreBgColor(score: number): string {
  if (score < 40) return 'bg-red-50 border-red-200';
  if (score < 70) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
}

export function getScoreLabel(score: number): string {
  if (score < 40) return 'Critical';
  if (score < 70) return 'Needs Improvement';
  return 'Good';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
  }
}