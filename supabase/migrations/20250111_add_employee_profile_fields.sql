-- Add profile fields to employees table
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);

-- Add comment
COMMENT ON COLUMN public.employees.address IS 'Employee residential address';
COMMENT ON COLUMN public.employees.emergency_contact_name IS 'Emergency contact full name';
COMMENT ON COLUMN public.employees.emergency_contact_phone IS 'Emergency contact phone number';

