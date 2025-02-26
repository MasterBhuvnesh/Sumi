-- Create the users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE, -- Links to Supabase auth users
  username TEXT UNIQUE NOT NULL, -- Unique username derived from email
  fullname TEXT, -- Full name of the user
  email TEXT UNIQUE NOT NULL, -- Email of the user
  profile_pic TEXT, -- URL to the profile picture
  date_of_birth DATE, -- Date of birth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the user was created
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the user was last updated
  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to manage their own data
CREATE POLICY "Users can manage their own data" ON users
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pics', 'profile_pics', true);

-- Allow all users to upload files to the profile_pics bucket
CREATE POLICY "Allow all uploads to profile_pics" ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile_pics');

-- Allow all users to view files in the profile_pics bucket
CREATE POLICY "Allow all reads from profile_pics" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile_pics');

-- Create a trigger function to insert a new row into the `users` table when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username TEXT;
BEGIN
  -- Extract the username from the email (remove everything after the '@')
  username := split_part(NEW.email, '@', 1);

  -- Insert the new user into the `users` table
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, username);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to the `auth.users` table
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- Create the quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Auto-generated UUID
  text TEXT NOT NULL, -- The text of the quote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the quote was created
  user_id UUID REFERENCES auth.users ON DELETE CASCADE -- Link to the user who created the quote
);

-- Enable Row Level Security (RLS) for the quotes table
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read quotes
CREATE POLICY "Allow public read access to quotes" ON quotes
FOR SELECT
TO public
USING (true); -- Anyone can read quotes

-- Policy: Allow authenticated users to insert quotes
CREATE POLICY "Allow authenticated users to insert quotes" ON quotes
FOR INSERT
TO authenticated
WITH CHECK (true); -- Authenticated users can insert quotes

-- Policy: Allow users to update their own quotes
CREATE POLICY "Allow users to update their own quotes" ON quotes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) -- Users can only update their own quotes
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own quotes
CREATE POLICY "Allow users to delete their own quotes" ON quotes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id); -- Users can only delete their own quotes



-- Turn on Real Time 
-- Enable realtime for the 'users' table
ALTER TABLE users
  ENABLE REPLICA ROW LEVEL SECURITY;

ALTER PUBLICATION supabase_realtime
  ADD TABLE users;

-- Enable realtime for the 'quotes' table
ALTER TABLE quotes
  ENABLE REPLICA ROW LEVEL SECURITY;

ALTER PUBLICATION supabase_realtime
  ADD TABLE quotes;