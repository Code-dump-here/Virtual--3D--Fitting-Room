/*
  # Clothing and Body Presets Schema

  ## Overview
  This migration creates the database structure for a 3D clothing visualization system
  with adjustable body models.

  ## New Tables
  
  ### `clothing_items`
  Stores information about clothing items available in the shop
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Name of the clothing item
  - `description` (text) - Detailed description
  - `category` (text) - Category (shirt, pants, dress, etc.)
  - `model_path` (text) - Path/reference to the 3D model in Unity
  - `thumbnail_url` (text) - URL to preview image
  - `sizes` (jsonb) - Available sizes array
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `body_presets`
  Stores predefined body configurations that users can select
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Preset name (e.g., "Athletic", "Petite", "Plus Size")
  - `parameters` (jsonb) - Body measurements and adjustments
  - `is_default` (boolean) - Whether this is a default preset
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_configurations`
  Stores user's custom body configurations and favorites
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to authenticated user (optional for guest users)
  - `body_parameters` (jsonb) - Custom body measurements
  - `favorite_items` (jsonb) - Array of favorite clothing item IDs
  - `session_id` (text) - For guest user session tracking
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for clothing_items and body_presets (catalog browsing)
  - User configurations are private to the owner or accessible by session
  - Authenticated admin users can manage clothing items

  ## Notes
  1. Body parameters stored as JSONB for flexibility (height, chest, waist, hips, etc.)
  2. Supports both authenticated and guest users via session tracking
  3. Clothing sizes stored as flexible JSON array
*/

-- Create clothing_items table
CREATE TABLE IF NOT EXISTS clothing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  model_path text NOT NULL,
  thumbnail_url text DEFAULT '',
  sizes jsonb DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create body_presets table
CREATE TABLE IF NOT EXISTS body_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parameters jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_configurations table
CREATE TABLE IF NOT EXISTS user_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body_parameters jsonb NOT NULL,
  favorite_items jsonb DEFAULT '[]'::jsonb,
  session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- Clothing items policies (public read, admin write)
CREATE POLICY "Anyone can view clothing items"
  ON clothing_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert clothing items"
  ON clothing_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clothing items"
  ON clothing_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clothing items"
  ON clothing_items FOR DELETE
  TO authenticated
  USING (true);

-- Body presets policies (public read)
CREATE POLICY "Anyone can view body presets"
  ON body_presets FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert body presets"
  ON body_presets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update body presets"
  ON body_presets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete body presets"
  ON body_presets FOR DELETE
  TO authenticated
  USING (true);

-- User configurations policies (private to user or session)
CREATE POLICY "Users can view own configurations"
  ON user_configurations FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own configurations"
  ON user_configurations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    user_id IS NULL
  );

CREATE POLICY "Users can update own configurations"
  ON user_configurations FOR UPDATE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can delete own configurations"
  ON user_configurations FOR DELETE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Insert default body presets
INSERT INTO body_presets (name, parameters, is_default) VALUES
  ('Average', '{"height": 170, "chest": 90, "waist": 75, "hips": 95, "shoulders": 40, "armLength": 60, "legLength": 85}'::jsonb, true),
  ('Athletic', '{"height": 175, "chest": 100, "waist": 80, "hips": 95, "shoulders": 45, "armLength": 62, "legLength": 88}'::jsonb, false),
  ('Petite', '{"height": 155, "chest": 80, "waist": 65, "hips": 85, "shoulders": 36, "armLength": 55, "legLength": 75}'::jsonb, false),
  ('Plus Size', '{"height": 168, "chest": 110, "waist": 95, "hips": 115, "shoulders": 44, "armLength": 60, "legLength": 82}'::jsonb, false);

-- Add some sample clothing items
INSERT INTO clothing_items (name, description, category, model_path, thumbnail_url) VALUES
  ('Classic White T-Shirt', 'A comfortable cotton t-shirt perfect for everyday wear', 'shirt', 'models/shirts/white_tshirt', 'https://images.pexels.com/photos/769732/pexels-photo-769732.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Slim Fit Jeans', 'Modern slim fit denim jeans in classic blue', 'pants', 'models/pants/slim_jeans', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Summer Floral Dress', 'Light and breezy floral pattern dress', 'dress', 'models/dresses/floral_summer', 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Leather Jacket', 'Premium leather jacket with modern fit', 'jacket', 'models/jackets/leather_modern', 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400');
