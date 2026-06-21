USE helfy_assignment;

INSERT INTO users (email, username, password_hash)
SELECT
  'admin@example.com',
  'admin',
  SHA2('admin123', 256)
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@example.com'
);