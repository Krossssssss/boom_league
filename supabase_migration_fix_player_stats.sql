-- Migration to fix player statistics tracking
-- This adds missing columns to players table and creates player_rankings table

-- Add missing columns to players table if they don't exist
DO $$ 
BEGIN
    -- Add total_games column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'total_games') THEN
        ALTER TABLE players ADD COLUMN total_games INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    -- Add average_placement column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'average_placement') THEN
        ALTER TABLE players ADD COLUMN average_placement NUMERIC(4,2) DEFAULT 0.00;
    END IF;
    
    -- Add win_rate column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'win_rate') THEN
        ALTER TABLE players ADD COLUMN win_rate NUMERIC(5,2) DEFAULT 0.00;
    END IF;
END $$;

-- Create or update player_rankings table structure
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'player_rankings') THEN
        CREATE TABLE player_rankings (
            id UUID NOT NULL,
            app_id TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            championships INTEGER NOT NULL DEFAULT 0,
            runner_up INTEGER NOT NULL DEFAULT 0,
            third_place INTEGER NOT NULL DEFAULT 0,
            total_vp INTEGER NOT NULL DEFAULT 0,
            total_games INTEGER NOT NULL DEFAULT 0,
            average_placement NUMERIC(4,2) DEFAULT 0.00,
            win_rate NUMERIC(5,2) DEFAULT 0.00,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            PRIMARY KEY (id, app_id)
        );
    ELSE
        -- Table exists, ensure all columns exist
        -- Add missing columns if they don't exist
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'total_games') THEN
            ALTER TABLE player_rankings ADD COLUMN total_games INTEGER NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'average_placement') THEN
            ALTER TABLE player_rankings ADD COLUMN average_placement NUMERIC(4,2) DEFAULT 0.00;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'win_rate') THEN
            ALTER TABLE player_rankings ADD COLUMN win_rate NUMERIC(5,2) DEFAULT 0.00;
        END IF;
    END IF;
END $$;

-- Ensure RLS is enabled for both tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_rankings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow anonymous access
DROP POLICY IF EXISTS "Allow anonymous access" ON players;
CREATE POLICY "Allow anonymous access" ON players FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow anonymous access" ON player_rankings;
CREATE POLICY "Allow anonymous access" ON player_rankings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_app_id ON players(app_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_app_id ON player_rankings(app_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_score ON player_rankings(score DESC);
CREATE INDEX IF NOT EXISTS idx_player_rankings_championships ON player_rankings(championships DESC);

-- Migrate existing data to player_rankings table
INSERT INTO player_rankings (
    id, app_id, name, avatar, score, championships, runner_up, third_place, 
    total_vp, total_games, average_placement, win_rate, updated_at
)
SELECT 
    id, app_id, name, avatar, score, championships, runner_up, third_place,
    total_vp, total_games, average_placement, win_rate, updated_at
FROM players
ON CONFLICT (id, app_id) DO UPDATE SET
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar,
    score = EXCLUDED.score,
    championships = EXCLUDED.championships,
    runner_up = EXCLUDED.runner_up,
    third_place = EXCLUDED.third_place,
    total_vp = EXCLUDED.total_vp,
    total_games = EXCLUDED.total_games,
    average_placement = EXCLUDED.average_placement,
    win_rate = EXCLUDED.win_rate,
    updated_at = NOW();
