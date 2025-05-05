
-- Define or update the check constraint for ticket_comments
CREATE OR REPLACE FUNCTION check_user_type_comments() RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_type is exactly 'admin' or 'user'
  IF NEW.user_type NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'user_type must be either ''admin'' or ''user''';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing constraint if it exists
ALTER TABLE public.ticket_comments DROP CONSTRAINT IF EXISTS ticket_comments_user_type_check;

-- Add the explicit check constraint
ALTER TABLE public.ticket_comments ADD CONSTRAINT ticket_comments_user_type_check 
  CHECK (user_type IN ('admin', 'user'));

-- Create trigger to enforce the constraint (belt and suspenders approach)
DROP TRIGGER IF EXISTS check_user_type_trigger ON public.ticket_comments;
CREATE TRIGGER check_user_type_trigger
BEFORE INSERT OR UPDATE ON public.ticket_comments
FOR EACH ROW
EXECUTE FUNCTION check_user_type_comments();
