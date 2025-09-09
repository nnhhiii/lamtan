const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // dùng service_role key cho backend, anon key cho frontend
);

module.exports = supabase;
