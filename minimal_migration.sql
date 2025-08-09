-- Minimal migration - just add the missing columns

-- Add missing columns to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS total_games INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS average_placement NUMERIC(4,2) DEFAULT 0.00;
ALTER TABLE players ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2) DEFAULT 0.00;

-- Add missing columns to player_rankings table
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS total_games INTEGER DEFAULT 0;
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS average_placement NUMERIC(4,2) DEFAULT 0.00;
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2) DEFAULT 0.00;
