-- Add new fields to subjects table for enhanced course catalog

ALTER TABLE subjects 
ADD COLUMN category VARCHAR(100) DEFAULT 'General' AFTER description,
ADD COLUMN difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner' AFTER category,
ADD COLUMN estimated_hours INT DEFAULT 0 AFTER difficulty_level,
ADD COLUMN tags JSON AFTER estimated_hours,
ADD COLUMN instructor VARCHAR(255) AFTER tags,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER is_published;

-- Add indexes for filtering
CREATE INDEX idx_category ON subjects(category);
CREATE INDEX idx_difficulty ON subjects(difficulty_level);
CREATE INDEX idx_featured ON subjects(is_featured);
