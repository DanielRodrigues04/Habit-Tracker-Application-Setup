/*
  # Initial Schema for Habit Tracker

  1. New Tables
    - `profiles`
      - User profile information
      - Linked to auth.users
    - `habits`
      - Core habits table
      - Stores habit definitions and configurations
    - `habit_logs`
      - Daily tracking of habit completion
    - `categories`
      - Predefined habit categories
    - `achievements`
      - User achievements and rewards
    - `group_habits`
      - Shared habits between users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE completion_status AS ENUM ('completed', 'skipped', 'pending');

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE,
  avatar_url text,
  streak_count int DEFAULT 0,
  points int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  description text,
  frequency frequency_type NOT NULL,
  start_date date NOT NULL,
  end_date date,
  reminder_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  status completion_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text,
  points int DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

-- Create group_habits table
CREATE TABLE IF NOT EXISTS group_habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_habits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view their habits"
  ON habits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their habits"
  ON habits FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their habit logs"
  ON habit_logs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default categories
INSERT INTO categories (name, color, icon) VALUES
  ('Saúde', '#10B981', 'heart'),
  ('Produtividade', '#3B82F6', 'briefcase'),
  ('Lazer', '#F59E0B', 'music'),
  ('Educação', '#8B5CF6', 'book-open'),
  ('Finanças', '#10B981', 'piggy-bank'),
  ('Social', '#EC4899', 'users')
ON CONFLICT DO NOTHING;