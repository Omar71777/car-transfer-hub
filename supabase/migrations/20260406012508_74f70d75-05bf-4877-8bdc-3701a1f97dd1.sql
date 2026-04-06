
-- Add FKs that don't already exist (skip bill_items ones that already exist)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'extra_charges_transfer_id_fkey') THEN
    ALTER TABLE public.extra_charges ADD CONSTRAINT extra_charges_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.transfers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'expenses_transfer_id_fkey') THEN
    ALTER TABLE public.expenses ADD CONSTRAINT expenses_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.transfers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bills_client_id_fkey') THEN
    ALTER TABLE public.bills ADD CONSTRAINT bills_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transfers_client_id_fkey') THEN
    ALTER TABLE public.transfers ADD CONSTRAINT transfers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transfers_vehicle_id_fkey') THEN
    ALTER TABLE public.transfers ADD CONSTRAINT transfers_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_company_id_fkey') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'vehicles_company_id_fkey') THEN
    ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create SECURITY DEFINER function for company creation
CREATE OR REPLACE FUNCTION public.create_company_for_user(
  _user_id uuid,
  _company_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _company_id uuid;
BEGIN
  INSERT INTO public.companies (name, user_id)
  VALUES (_company_name, _user_id)
  RETURNING id INTO _company_id;

  UPDATE public.profiles
  SET company_id = _company_id, user_subtype = 'company_admin'
  WHERE id = _user_id;

  RETURN _company_id;
END;
$$;

-- Protect role field
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
