import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addEnumType() {
    console.log("Checking database enum doc_category...");

    // Note: Since we don't have direct SQL execution privileges via the standard Javascript client without a specialized RPC,
    // we will generate the exact SQL for the user.

    const sql = `
ALTER TYPE doc_category ADD VALUE IF NOT EXISTS 'exam';
  `;

    console.log("--------------------------------------------------------------------------------");
    console.log("Lỗi bạn gặp phải là do kiểu dữ liệu ENUM trong Database chưa có tuỳ chọn 'exam'.");
    console.log("Bạn hãy copy đoạn mã SQL bên dưới, dán vào phần SQL Editor của Supabase và nhấn RUN nhé:");
    console.log("");
    console.log(sql.trim());
    console.log("");
    console.log("--------------------------------------------------------------------------------");
}

addEnumType();
