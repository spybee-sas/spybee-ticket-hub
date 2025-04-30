
-- Create a function to check admin password securely
CREATE OR REPLACE FUNCTION public.check_admin_password(admin_email TEXT, admin_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
  result BOOLEAN;
BEGIN
  -- Get the stored hash for the email
  SELECT password_hash INTO stored_hash
  FROM public.admins
  WHERE email = admin_email;
  
  -- If no record found, return false
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check password against hash
  SELECT stored_hash = crypt(admin_password, stored_hash) INTO result;
  
  RETURN result;
END;
$$;

-- Add a comment to the function
COMMENT ON FUNCTION public.check_admin_password IS 'Function that securely checks admin password against stored hash';
