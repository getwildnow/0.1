-- Add Veriff verification columns to employees table

-- Add veriff_status enum type
DO $$ BEGIN
  CREATE TYPE veriff_status_enum AS ENUM (
    'not_started',
    'pending',
    'submitted',
    'approved',
    'declined',
    'resubmission_requested',
    'expired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add Veriff columns to employees table
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS veriff_session_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS veriff_status veriff_status_enum DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS veriff_person JSONB,
  ADD COLUMN IF NOT EXISTS veriff_decision_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS veriff_attempts INTEGER DEFAULT 0;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS employees_veriff_session_id_idx ON public.employees(veriff_session_id);
CREATE INDEX IF NOT EXISTS employees_veriff_status_idx ON public.employees(veriff_status);

-- Update existing status column to support verification flow
-- Current flow: invited → verification_pending → verified → active
COMMENT ON COLUMN public.employees.status IS 'Employee status: invited, verification_pending, verified, active, inactive';
COMMENT ON COLUMN public.employees.veriff_status IS 'Veriff verification status from identity verification process';
COMMENT ON COLUMN public.employees.veriff_session_id IS 'Veriff session ID for tracking verification';
COMMENT ON COLUMN public.employees.veriff_person IS 'Person data from Veriff (firstName, lastName, dateOfBirth, etc.)';
COMMENT ON COLUMN public.employees.veriff_decision_time IS 'When Veriff made the verification decision';
COMMENT ON COLUMN public.employees.verification_completed_at IS 'When employee completed the verification process';
COMMENT ON COLUMN public.employees.veriff_attempts IS 'Number of verification attempts';

