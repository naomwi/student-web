import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // We need service role key to bypass RLS and create policies

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateStorageRLS() {
    console.log("Checking storage policies...");

    // Storage policies are managed via SQL.
    // We'll execute a raw SQL query to create a policy that allows any authenticated user to SELECT from the student-docs bucket.

    const sql = `
    -- Allow public read access to student-docs bucket
    CREATE POLICY "Allow public read access to student-docs"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'student-docs');
  `;

    // Note: Since we can't easily run raw SQL from the JS client without a custom RPC,
    // we will instead instruct the user to run this SQL in their Supabase dashboard.
    console.log("To fix the download issue, please run the following SQL command in your Supabase SQL Editor:");
    console.log("--------------------------------------------------");
    console.log(sql);
    console.log("--------------------------------------------------");
}

updateStorageRLS();
