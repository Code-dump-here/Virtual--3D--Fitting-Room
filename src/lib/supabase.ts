import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BodyParameters {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  armLength: number;
  legLength: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  category: string;
  model_path: string;
  thumbnail_url: string;
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export interface BodyPreset {
  id: string;
  name: string;
  parameters: BodyParameters;
  is_default: boolean;
  created_at: string;
}

export interface UserConfiguration {
  id: string;
  user_id?: string;
  body_parameters: BodyParameters;
  favorite_items: string[];
  session_id?: string;
  created_at: string;
  updated_at: string;
}
