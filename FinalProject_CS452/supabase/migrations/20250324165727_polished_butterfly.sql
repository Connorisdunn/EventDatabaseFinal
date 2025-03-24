/*
  # Add wedding services

  1. Changes
    - Insert sample services data
  
  2. Security
    - Maintain existing RLS policies
*/

-- Insert sample services if they don't exist
INSERT INTO services (name, description, price)
SELECT
  'Full Wedding Planning',
  'Comprehensive wedding planning service from start to finish, including vendor coordination, timeline management, and day-of coordination.',
  5000
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Full Wedding Planning'
);

INSERT INTO services (name, description, price)
SELECT
  'Day-of Coordination',
  'Professional coordination services for your wedding day, ensuring everything runs smoothly.',
  1500
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Day-of Coordination'
);

INSERT INTO services (name, description, price)
SELECT
  'Floral Design Package',
  'Custom floral arrangements including bridal bouquet, centerpieces, and venue decoration.',
  2500
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Floral Design Package'
);

INSERT INTO services (name, description, price)
SELECT
  'Photography Package',
  'Professional photography coverage of your special day, including engagement session and wedding album.',
  3000
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Photography Package'
);

INSERT INTO services (name, description, price)
SELECT
  'Catering Service',
  'Gourmet catering service including appetizers, main course, and dessert stations.',
  8000
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Catering Service'
);

INSERT INTO services (name, description, price)
SELECT
  'Entertainment Package',
  'Professional DJ services, lighting setup, and dance floor arrangement.',
  2000
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Entertainment Package'
);