-- Boom League Tournament Tracker - Migration Script
-- This SQL migrates existing tables to the new structure without losing data
-- Run this if you already have players and league_state tables

-- 1. BACKUP EXISTING DATA (optional but recommended)
-- CREATE TABLE players_backup AS SELECT * FROM players;
-- CREATE TABLE league_state_backup AS SELECT * FROM league_state;

-- 2. ADD MISSING COLUMNS TO PLAYERS TABLE
-- Add new columns if they don't exist
DO $$ 
BEGIN
    -- Add runner_up column (mapped from runnerUp in TypeScript)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'runner_up') THEN
        ALTER TABLE players ADD COLUMN runner_up INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    -- Add third_place column (mapped from thirdPlace in TypeScript) 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'third_place') THEN
        ALTER TABLE players ADD COLUMN third_place INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    -- Add total_vp column (mapped from totalVP in TypeScript)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'total_vp') THEN
        ALTER TABLE players ADD COLUMN total_vp INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    -- Add timestamps if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'created_at') THEN
        ALTER TABLE players ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'updated_at') THEN
        ALTER TABLE players ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 3. ADD MISSING COLUMNS TO LEAGUE_STATE TABLE
DO $$ 
BEGIN
    -- Add league_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'league_name') THEN
        ALTER TABLE league_state ADD COLUMN league_name TEXT;
    END IF;
    
    -- Add season_number column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'season_number') THEN
        ALTER TABLE league_state ADD COLUMN season_number INTEGER;
    END IF;
    
    -- Add start_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'start_date') THEN
        ALTER TABLE league_state ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add end_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'end_date') THEN
        ALTER TABLE league_state ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add created_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'created_at') THEN
        ALTER TABLE league_state ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'updated_at') THEN
        ALTER TABLE league_state ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add selected_special_rules column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'league_state' AND column_name = 'selected_special_rules') THEN
        ALTER TABLE league_state ADD COLUMN selected_special_rules JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 4. UPDATE COLUMN TYPES AND CONSTRAINTS
-- Ensure proper data types and constraints
DO $$
BEGIN
    -- Update status column to have proper CHECK constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'league_state_status_check'
    ) THEN
        ALTER TABLE league_state ADD CONSTRAINT league_state_status_check 
        CHECK (status IN ('setup', 'pending_confirmation', 'in_progress', 'finished'));
    END IF;
    
    -- Ensure app_id is unique in league_state
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'league_state_app_id_key' 
        AND table_name = 'league_state'
    ) THEN
        ALTER TABLE league_state ADD CONSTRAINT league_state_app_id_key UNIQUE (app_id);
    END IF;
END $$;

-- 5. CREATE LEAGUE_HISTORY TABLE (if it doesn't exist)
CREATE TABLE IF NOT EXISTS league_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id TEXT NOT NULL,
    league_name TEXT NOT NULL,
    season_number INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    winner JSONB NOT NULL,
    final_standings JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_rounds INTEGER NOT NULL,
    total_players INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CREATE INDEXES (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_players_app_id ON players(app_id);
CREATE INDEX IF NOT EXISTS idx_players_score ON players(score DESC);
CREATE INDEX IF NOT EXISTS idx_players_total_vp ON players(total_vp DESC);
CREATE INDEX IF NOT EXISTS idx_players_championships ON players(championships DESC);
CREATE INDEX IF NOT EXISTS idx_league_state_app_id ON league_state(app_id);
CREATE INDEX IF NOT EXISTS idx_league_state_status ON league_state(status);
CREATE INDEX IF NOT EXISTS idx_league_history_app_id ON league_history(app_id);
CREATE INDEX IF NOT EXISTS idx_league_history_season ON league_history(season_number DESC);

-- 7. CREATE UPDATE TRIGGER FUNCTION (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. CREATE TRIGGERS (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_players_updated_at'
    ) THEN
        CREATE TRIGGER update_players_updated_at 
            BEFORE UPDATE ON players 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_league_state_updated_at'
    ) THEN
        CREATE TRIGGER update_league_state_updated_at 
            BEFORE UPDATE ON league_state 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 9. ENABLE ROW LEVEL SECURITY (if not already enabled)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_history ENABLE ROW LEVEL SECURITY;

-- 10. CREATE RLS POLICIES (if they don't exist)
-- Players table policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'players' AND policyname = 'Allow anonymous read access on players'
    ) THEN
        CREATE POLICY "Allow anonymous read access on players" 
            ON players FOR SELECT 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'players' AND policyname = 'Allow anonymous insert access on players'
    ) THEN
        CREATE POLICY "Allow anonymous insert access on players" 
            ON players FOR INSERT 
            WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'players' AND policyname = 'Allow anonymous update access on players'
    ) THEN
        CREATE POLICY "Allow anonymous update access on players" 
            ON players FOR UPDATE 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'players' AND policyname = 'Allow anonymous delete access on players'
    ) THEN
        CREATE POLICY "Allow anonymous delete access on players" 
            ON players FOR DELETE 
            USING (true);
    END IF;
END $$;

-- League state table policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_state' AND policyname = 'Allow anonymous read access on league_state'
    ) THEN
        CREATE POLICY "Allow anonymous read access on league_state" 
            ON league_state FOR SELECT 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_state' AND policyname = 'Allow anonymous insert access on league_state'
    ) THEN
        CREATE POLICY "Allow anonymous insert access on league_state" 
            ON league_state FOR INSERT 
            WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_state' AND policyname = 'Allow anonymous update access on league_state'
    ) THEN
        CREATE POLICY "Allow anonymous update access on league_state" 
            ON league_state FOR UPDATE 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_state' AND policyname = 'Allow anonymous delete access on league_state'
    ) THEN
        CREATE POLICY "Allow anonymous delete access on league_state" 
            ON league_state FOR DELETE 
            USING (true);
    END IF;
END $$;

-- League history table policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_history' AND policyname = 'Allow anonymous read access on league_history'
    ) THEN
        CREATE POLICY "Allow anonymous read access on league_history" 
            ON league_history FOR SELECT 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_history' AND policyname = 'Allow anonymous insert access on league_history'
    ) THEN
        CREATE POLICY "Allow anonymous insert access on league_history" 
            ON league_history FOR INSERT 
            WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_history' AND policyname = 'Allow anonymous update access on league_history'
    ) THEN
        CREATE POLICY "Allow anonymous update access on league_history" 
            ON league_history FOR UPDATE 
            USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_history' AND policyname = 'Allow anonymous delete access on league_history'
    ) THEN
        CREATE POLICY "Allow anonymous delete access on league_history" 
            ON league_history FOR DELETE 
            USING (true);
    END IF;
END $$;

-- 11. CREATE VIEWS (if they don't exist)
CREATE OR REPLACE VIEW player_rankings AS
SELECT 
    id,
    app_id,
    name,
    avatar,
    score,
    championships,
    runner_up,
    third_place,
    total_vp,
    jsonb_array_length(history) as total_games,
    CASE 
        WHEN jsonb_array_length(history) > 0 THEN
            ROUND(
                (SELECT SUM((elem->>'placement')::numeric) FROM jsonb_array_elements(history) elem) / 
                jsonb_array_length(history), 
                2
            )
        ELSE NULL 
    END as average_placement,
    CASE 
        WHEN jsonb_array_length(history) > 0 THEN
            ROUND(
                (SELECT COUNT(*) FROM jsonb_array_elements(history) elem WHERE (elem->>'placement')::int = 1)::numeric / 
                jsonb_array_length(history) * 100, 
                1
            )
        ELSE 0 
    END as win_rate
FROM players
ORDER BY score DESC, total_vp DESC;

-- 12. UPDATE EXISTING DATA (if needed)
-- Set created_at for existing records that don't have it
UPDATE players SET created_at = NOW() WHERE created_at IS NULL;
UPDATE league_state SET created_at = NOW() WHERE created_at IS NULL;
UPDATE league_state SET updated_at = NOW() WHERE updated_at IS NULL;

-- 13. ADD COMMENTS
COMMENT ON TABLE players IS 'Stores player profiles, stats, and game history';
COMMENT ON TABLE league_state IS 'Stores current active league state and configuration';  
COMMENT ON TABLE league_history IS 'Stores completed league records for historical tracking';

COMMENT ON COLUMN players.history IS 'JSONB array of game history: [{"round": 1, "placement": 2}, ...]';
COMMENT ON COLUMN players.total_vp IS 'Cumulative VP earned across all leagues';
COMMENT ON COLUMN league_state.schedule IS 'JSONB array of round configurations';
COMMENT ON COLUMN league_state.winner IS 'JSONB object with winner details: {"name": "...", "avatar": "...", "reason": "..."}';
COMMENT ON COLUMN league_state.selected_special_rules IS 'JSONB array of selected special rules for the league';
COMMENT ON COLUMN league_history.final_standings IS 'JSONB array of final player standings';

COMMENT ON VIEW player_rankings IS 'Comprehensive player rankings with calculated stats';

-- VERIFICATION QUERIES
SELECT 'Migration completed successfully!' as status;
SELECT 
    'Players table columns: ' || string_agg(column_name, ', ' ORDER BY ordinal_position) as players_columns
FROM information_schema.columns 
WHERE table_name = 'players';

SELECT 
    'League state columns: ' || string_agg(column_name, ', ' ORDER BY ordinal_position) as league_state_columns
FROM information_schema.columns 
WHERE table_name = 'league_state';

SELECT 
    'League history columns: ' || string_agg(column_name, ', ' ORDER BY ordinal_position) as league_history_columns
FROM information_schema.columns 
WHERE table_name = 'league_history';
