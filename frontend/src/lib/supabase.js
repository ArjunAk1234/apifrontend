import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR SUPABASE PROJECT DETAILS
const SUPABASE_URL = 'https://dwwxzhrmhnmnylymefjx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3d3h6aHJtaG5tbnlseW1lZmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg1NjI5MCwiZXhwIjoyMDc4NDMyMjkwfQ.2KZgqcxUpBr8BO9Znsx7HAOvCIoz6uK4kGWQ0AqvxKY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);