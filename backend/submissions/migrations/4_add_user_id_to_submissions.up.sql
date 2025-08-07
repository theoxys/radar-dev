ALTER TABLE submissions ADD COLUMN user_id TEXT;

CREATE INDEX idx_submissions_user_id ON submissions(user_id);
