import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email, details } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Log the request in the database
        // Assuming there might be a logs or requests table, 
        // if not we'll just log it to the console for now as requested.
        console.log(`[DATA DELETION REQUEST] Email: ${email}, Details: ${details || 'None'}`);

        // In a real production app, we would:
        // 1. Insert into a `deletion_requests` table
        // 2. Send an automated email to support@lezmarket.io
        // 3. Send a confirmation email to the user

        const { error } = await supabase
            .from('deletion_requests')
            .insert([
                {
                    email,
                    details: details || '',
                    status: 'pending',
                    requested_at: new Date().toISOString()
                }
            ]);

        // If table doesn't exist, we don't want to fail the user request
        if (error && error.code === '42P01') {
            console.warn('deletion_requests table does not exist. Request logged to console only.');
        } else if (error) {
            console.error('Database error recording deletion request:', error);
            // We still return 200 if we logged it to console, 
            // but in a strict env we might throw.
        }

        return NextResponse.json(
            { message: 'Request received successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error handling data deletion request:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
