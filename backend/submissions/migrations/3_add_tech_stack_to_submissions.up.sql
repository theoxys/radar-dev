CREATE TABLE submission_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, technology_id)
);

CREATE INDEX idx_submission_technologies_submission_id ON submission_technologies(submission_id);
CREATE INDEX idx_submission_technologies_technology_id ON submission_technologies(technology_id);
