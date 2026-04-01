-- Enable Row Level Security
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending'::text CHECK (status IN ('pending', 'done')) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Policies
-- 1. Users can view their own tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a storage bucket for any potential assets (optional but good practice)
-- INSERT INTO storage.buckets (id, name) VALUES ('assets', 'assets');
