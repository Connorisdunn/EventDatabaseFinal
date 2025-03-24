/*
  # Add image URLs to venues

  1. Changes
    - Add image_url column to venues table
    - Add description column to venues table
    - Insert sample venue data
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE venues ADD COLUMN image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'description'
  ) THEN
    ALTER TABLE venues ADD COLUMN description text;
  END IF;
END $$;

-- Insert sample venues if they don't exist
INSERT INTO venues (name, address, capacity, image_url, description)
SELECT
  'Grand Ballroom',
  '789 Elegance Way, Luxuryville, ST 54321',
  300,
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Our flagship venue featuring crystal chandeliers, marble floors, and panoramic city views.'
WHERE NOT EXISTS (
  SELECT 1 FROM venues WHERE name = 'Grand Ballroom'
);

INSERT INTO venues (name, address, capacity, image_url, description)
SELECT
  'Garden Terrace',
  '456 Nature Lane, Greenville, ST 67890',
  150,
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'An enchanting outdoor venue surrounded by manicured gardens and water features.'
WHERE NOT EXISTS (
  SELECT 1 FROM venues WHERE name = 'Garden Terrace'
);

INSERT INTO venues (name, address, capacity, image_url, description)
SELECT
  'Lakeside Manor',
  '123 Waterfront Drive, Laketown, ST 12345',
  200,
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'A stunning waterfront venue with floor-to-ceiling windows and a private dock.'
WHERE NOT EXISTS (
  SELECT 1 FROM venues WHERE name = 'Lakeside Manor'
);