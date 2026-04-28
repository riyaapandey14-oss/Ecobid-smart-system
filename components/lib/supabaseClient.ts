
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    console.error('Supabase URL or Key is missing. Please check your .env file.');
    console.error('Current URL:', supabaseUrl);
    // Don't log the key for security, but check if it's defined
    console.error('Key exists:', !!supabaseKey);
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
