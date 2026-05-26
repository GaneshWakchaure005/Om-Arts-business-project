import { supabase } from "../lib/supabase";

export const login = async (email, password) => {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return { data, error };
};