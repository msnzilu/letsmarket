// scripts/debug-db.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log('Testing query on websites...');
    const { data, error } = await supabase
        .from('websites')
        .select('*, analyses(*)');

    if (error) {
        console.error('Query Error Details:');
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        console.error('Code:', error.code);
    } else {
        console.log('Query successful, found', data?.length, 'websites');
    }
}

debug();
