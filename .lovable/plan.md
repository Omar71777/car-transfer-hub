

## Plan: Create All Database Tables for New Supabase Project

The new Supabase project has no tables. All the app's code references tables that need to be created. I'll create a single migration with all required tables, RLS policies, and triggers.

### Tables to Create

Based on the codebase, these tables are needed:

1. **profiles** - User profiles (linked to auth.users)
   - id (uuid, FK to auth.users), email, first_name, last_name, role (admin/user), user_subtype, company_id, company_name, company_address, company_tax_id, company_phone, company_email, company_logo, created_at, updated_at

2. **companies** - Company records
   - id, name, address, tax_id, phone, email, logo, user_id, created_at, updated_at

3. **clients** - Client records
   - id, name, email, phone, address, tax_id, notes, user_id, created_at, updated_at

4. **transfers** - Core transfer data
   - id, date, time, service_type, origin, destination, price, hours, discount_type, discount_value, collaborator, commission, commission_type, payment_status, payment_method, billed, client_id (FK), vehicle_id, user_id, created_at, updated_at

5. **extra_charges** - Extra charges on transfers
   - id, transfer_id (FK), name, price, created_at

6. **expenses** - Expenses linked to transfers
   - id, transfer_id (FK), date, concept, amount, user_id, created_at

7. **bills** - Billing records
   - id, client_id (FK), number, date, due_date, sub_total, tax_rate, tax_amount, tax_application, total, notes, status, user_id, created_at, updated_at

8. **bill_items** - Line items on bills
   - id, bill_id (FK), transfer_id, description, quantity, unit_price, total_price, is_extra_charge, extra_charge_id, parent_item_id, created_at

9. **vehicles** - Vehicle records
   - id, company_id, make, model, year, license_plate, vehicle_type, capacity, status, user_id, created_at, updated_at

### Additional Setup

- **RLS policies** on all tables: users can only CRUD their own data
- **Trigger**: auto-create profile on new user signup (`handle_new_user`)
- **Enums**: user_role (admin, user), service_type, discount_type, payment_status, payment_method, bill_status, vehicle_type

### Technical Details

- Single SQL migration with all CREATE TABLE, enum, RLS policy, and trigger statements
- Foreign keys use `ON DELETE CASCADE` where appropriate
- All tables have `user_id` column for RLS filtering
- The `profiles` table uses `auth.users(id)` as FK with cascade delete
- The types.ts file will auto-regenerate after migration

