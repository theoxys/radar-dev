CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_link TEXT NOT NULL,
  position TEXT NOT NULL,
  salary DOUBLE PRECISION NOT NULL,
  comments TEXT,
  benefits TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_salary ON submissions(salary);
CREATE INDEX idx_submissions_company_name ON submissions(company_name);
CREATE INDEX idx_submissions_position ON submissions(position);
