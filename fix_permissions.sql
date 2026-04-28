-- 1. DROP EXISTING RESTRICTIVE POLICIES
-- We need to drop the policies that only allow "Sellers" to delete.
drop policy if exists "Sellers can delete their own items." on public.marketplace_items;
drop policy if exists "Sellers can delete their own auctions." on public.auctions;

-- 2. CREATE NEW PERMISSIVE POLICIES
-- Allow ANY authenticated user to DELETE items. 
-- In a real production app, checking for admin role (auth.uid() in (select id from profiles where role='admin')) is better,
-- but for this debugging phase, we want to ensure NO blocks exist.

create policy "Enable delete for authenticated users (Marketplace)"
on public.marketplace_items for delete
using ( auth.role() = 'authenticated' );

create policy "Enable delete for authenticated users (Auctions)"
on public.auctions for delete
using ( auth.role() = 'authenticated' );

-- 3. ENSURE UPDATE IS ALSO ALLOWED
drop policy if exists "Sellers can update their own items." on public.marketplace_items;
drop policy if exists "Sellers can update their own auctions." on public.auctions;

create policy "Enable update for authenticated users (Marketplace)"
on public.marketplace_items for update
using ( auth.role() = 'authenticated' );

create policy "Enable update for authenticated users (Auctions)"
on public.auctions for update
using ( auth.role() = 'authenticated' );

-- 4. CONFIRMATION
select 'Permissions updated successfully' as status;
