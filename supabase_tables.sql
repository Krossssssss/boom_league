-- Boom League Tournament Tracker - Supabase Database Schema
-- This SQL creates the complete database structure for the application

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (use with caution in production)
DROP TABLE IF EXISTS league_history CASCADE;
DROP TABLE IF EXISTS league_state CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- 1. PLAYERS TABLE
-- Stores all player information including stats and game history
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '😼',
    score INTEGER NOT NULL DEFAULT 0,
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    championships INTEGER NOT NULL DEFAULT 0,
    runner_up INTEGER NOT NULL DEFAULT 0,     -- 亚军次数 (note: using snake_case for SQL)
    third_place INTEGER NOT NULL DEFAULT 0,  -- 季军次数
    total_vp INTEGER NOT NULL DEFAULT 0,     -- 总VP获得数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LEAGUE_STATE TABLE  
-- Stores current active league state and configuration
CREATE TABLE league_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'setup' CHECK (status IN ('setup', 'pending_confirmation', 'in_progress', 'finished')),
    current_round INTEGER NOT NULL DEFAULT 0,
    schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
    winner JSONB DEFAULT NULL,
    league_name TEXT,
    season_number INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    selected_special_rules JSONB DEFAULT '[]'::jsonb
);

-- 3. LEAGUE_HISTORY TABLE
-- Stores completed league records for historical tracking
CREATE TABLE league_history (
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

-- INDEXES for performance optimization
CREATE INDEX idx_players_app_id ON players(app_id);
CREATE INDEX idx_players_score ON players(score DESC);
CREATE INDEX idx_players_total_vp ON players(total_vp DESC);
CREATE INDEX idx_players_championships ON players(championships DESC);
CREATE INDEX idx_league_state_app_id ON league_state(app_id);
CREATE INDEX idx_league_state_status ON league_state(status);
CREATE INDEX idx_league_history_app_id ON league_history(app_id);
CREATE INDEX idx_league_history_season ON league_history(season_number DESC);

-- TRIGGERS for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_league_state_updated_at 
    BEFORE UPDATE ON league_state 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_history ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (adjust as needed for your security requirements)
-- Players table policies
CREATE POLICY "Allow anonymous read access on players" 
    ON players FOR SELECT 
    USING (true);

CREATE POLICY "Allow anonymous insert access on players" 
    ON players FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update access on players" 
    ON players FOR UPDATE 
    USING (true);

CREATE POLICY "Allow anonymous delete access on players" 
    ON players FOR DELETE 
    USING (true);

-- League state table policies  
CREATE POLICY "Allow anonymous read access on league_state" 
    ON league_state FOR SELECT 
    USING (true);

CREATE POLICY "Allow anonymous insert access on league_state" 
    ON league_state FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update access on league_state" 
    ON league_state FOR UPDATE 
    USING (true);

CREATE POLICY "Allow anonymous delete access on league_state" 
    ON league_state FOR DELETE 
    USING (true);

-- League history table policies
CREATE POLICY "Allow anonymous read access on league_history" 
    ON league_history FOR SELECT 
    USING (true);

CREATE POLICY "Allow anonymous insert access on league_history" 
    ON league_history FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update access on league_history" 
    ON league_history FOR UPDATE 
    USING (true);

CREATE POLICY "Allow anonymous delete access on league_history" 
    ON league_history FOR DELETE 
    USING (true);

-- SAMPLE DATA (optional - remove in production)
-- Insert sample players for testing
INSERT INTO players (app_id, name, avatar, score, championships, runner_up, third_place, total_vp, history) VALUES
('boom-league-default', 'Alice', '😼', 0, 2, 1, 0, 45, '[{"round": 1, "placement": 1}, {"round": 2, "placement": 2}]'::jsonb),
('boom-league-default', 'Bob', '😻', 0, 1, 2, 1, 38, '[{"round": 1, "placement": 2}, {"round": 2, "placement": 1}]'::jsonb),
('boom-league-default', 'Charlie', '🙀', 0, 0, 1, 2, 22, '[{"round": 1, "placement": 3}, {"round": 2, "placement": 3}]'::jsonb);

-- Insert initial league state
INSERT INTO league_state (app_id, status, current_round, schedule, winner) VALUES
('boom-league-default', 'setup', 0, '[]'::jsonb, NULL);

-- COMMENTS for documentation
COMMENT ON TABLE players IS 'Stores player profiles, stats, and game history';
COMMENT ON TABLE league_state IS 'Stores current active league state and configuration';  
COMMENT ON TABLE league_history IS 'Stores completed league records for historical tracking';

COMMENT ON COLUMN players.history IS 'JSONB array of game history: [{"round": 1, "placement": 2}, ...]';
COMMENT ON COLUMN players.total_vp IS 'Cumulative VP earned across all leagues';
COMMENT ON COLUMN league_state.schedule IS 'JSONB array of round configurations';
COMMENT ON COLUMN league_state.winner IS 'JSONB object with winner details: {"name": "...", "avatar": "...", "reason": "..."}';
COMMENT ON COLUMN league_state.selected_special_rules IS 'JSONB array of selected special rules for the league';
COMMENT ON COLUMN league_history.final_standings IS 'JSONB array of final player standings';

-- VIEWS for common queries (optional)
CREATE VIEW player_rankings AS
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

COMMENT ON VIEW player_rankings IS 'Comprehensive player rankings with calculated stats';

-- Verification queries (run these to test the setup)
-- SELECT 'Players table created successfully' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'players');
-- SELECT 'League state table created successfully' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'league_state');  
-- SELECT 'League history table created successfully' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'league_history');
-- SELECT * FROM player_rankings;
