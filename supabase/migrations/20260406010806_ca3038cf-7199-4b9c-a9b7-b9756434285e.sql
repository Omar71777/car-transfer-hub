
CREATE TABLE public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own collaborators" ON public.collaborators FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
