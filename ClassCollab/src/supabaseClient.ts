import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkcjczpalfuvjkkbpagg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrY2pjenBhbGZ1dmpra2JwYWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjczMTMsImV4cCI6MjA2MDkwMzMxM30.wlgRQF3SqW8bPvoIvi0r5Ea6Yaf9jKpBpqWe0kzyLkU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
