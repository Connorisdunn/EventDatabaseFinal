/*
  # Wedding Venue Initial Schema

  1. New Tables
    - venues
      - id (uuid, primary key)
      - name (text)
      - address (text)
      - capacity (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - events
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - start_time (timestamp)
      - end_time (timestamp)
      - venue_id (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - customers
      - id (uuid, primary key)
      - name (text)
      - email (text)
      - phone_number (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - bookings
      - id (uuid, primary key)
      - customer_id (uuid, foreign key)
      - event_id (uuid, foreign key)
      - booking_date (timestamp)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - services
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - event_services
      - event_id (uuid)
      - service_id (uuid)
      - created_at (timestamp)
      - PRIMARY KEY (event_id, service_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Venues table
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  capacity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  booking_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Services junction table
CREATE TABLE event_services (
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (event_id, service_id)
);

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public venues are viewable by everyone" ON venues
  FOR SELECT USING (true);

CREATE POLICY "Public events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Public services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can view their own bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Event services are viewable by everyone" ON event_services
  FOR SELECT USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();