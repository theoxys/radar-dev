CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_technologies_name ON technologies(name);

-- Insert some common technologies
INSERT INTO technologies (name) VALUES 
  ('React'),
  ('Vue.js'),
  ('Angular'),
  ('Node.js'),
  ('Python'),
  ('Java'),
  ('JavaScript'),
  ('TypeScript'),
  ('PHP'),
  ('C#'),
  ('Go'),
  ('Rust'),
  ('Docker'),
  ('Kubernetes'),
  ('AWS'),
  ('Azure'),
  ('PostgreSQL'),
  ('MySQL'),
  ('MongoDB'),
  ('Redis');
