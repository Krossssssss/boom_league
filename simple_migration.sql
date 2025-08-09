-- Simple migration to add missing columns
-- This avoids complex syntax and focuses on just adding the missing fields

-- Add missing columns to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS total_games INTEGER NOT NULL DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS average_placement NUMERIC(4,2) DEFAULT 0.00;
ALTER TABLE players ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2) DEFAULT 0.00;

-- Add missing columns to player_rankings table (if it exists)
-- Note: IF NOT EXISTS syntax for ALTER TABLE ADD COLUMN is supported in PostgreSQL 9.6+
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS total_games INTEGER NOT NULL DEFAULT 0;
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS average_placement NUMERIC(4,2) DEFAULT 0.00;
ALTER TABLE player_rankings ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2) DEFAULT 0.00;

-- Ensure RLS is enabled
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_rankings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies
DROP POLICY IF EXISTS "Allow anonymous access" ON players;
CREATE POLICY "Allow anonymous access" ON players FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anonymous access" ON player_rankings;
CREATE POLICY "Allow anonymous access" ON player_rankings FOR ALL USING (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_players_app_id ON players(app_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_app_id ON player_rankings(app_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_score ON player_rankings(score DESC);
CREATE INDEX IF NOT EXISTS idx_player_rankings_championships ON player_rankings(championships DESC);
