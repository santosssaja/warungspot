-- WarungSpot Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  address_clue TEXT,
  category VARCHAR(100) NOT NULL,
  marketing_desc TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  banner_image_url TEXT,
  product_images_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_category ON shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_created_at ON shops(created_at DESC);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read shops
CREATE POLICY "Anyone can view shops"
  ON shops
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own shops
CREATE POLICY "Users can insert their own shops"
  ON shops
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own shops
CREATE POLICY "Users can update their own shops"
  ON shops
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own shops
CREATE POLICY "Users can delete their own shops"
  ON shops
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for shop images
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-images', 'shop-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for shop-images bucket
CREATE POLICY "Anyone can view shop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-images');

CREATE POLICY "Authenticated users can upload shop images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'shop-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own shop images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'shop-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own shop images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'shop-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
