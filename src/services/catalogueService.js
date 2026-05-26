import { supabase } from "../lib/supabase";

//function to select from supabase
export const getCatalogue = async () => {
  const { data, error } = await supabase
    .from("catalogue")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

//function to insert into supabase 
export const addProduct = async (product) => {

  const { data, error } = await supabase
    .from("catalogue")
    .insert([product]);

  return { data, error };
};