
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

CREATE POLICY "Users can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
