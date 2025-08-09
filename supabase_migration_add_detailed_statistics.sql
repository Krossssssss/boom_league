-- Migration to add detailed player statistics fields
-- This adds separate league-level and round-level statistics

-- Add new columns to players table
DO $$ 
BEGIN
    -- League-level statistics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'league_championships') THEN
        ALTER TABLE players ADD COLUMN league_championships INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added league_championships column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'league_runner_up') THEN
        ALTER TABLE players ADD COLUMN league_runner_up INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added league_runner_up column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'league_third_place') THEN
        ALTER TABLE players ADD COLUMN league_third_place INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added league_third_place column to players table';
    END IF;
    
    -- Round-level statistics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'round_championships') THEN
        ALTER TABLE players ADD COLUMN round_championships INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added round_championships column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'round_runner_up') THEN
        ALTER TABLE players ADD COLUMN round_runner_up INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added round_runner_up column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'round_third_place') THEN
        ALTER TABLE players ADD COLUMN round_third_place INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added round_third_place column to players table';
    END IF;
    
    -- Game statistics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'total_leagues') THEN
        ALTER TABLE players ADD COLUMN total_leagues INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added total_leagues column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'total_rounds') THEN
        ALTER TABLE players ADD COLUMN total_rounds INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added total_rounds column to players table';
    END IF;
    
    -- Average and win rate statistics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'round_average_placement') THEN
        ALTER TABLE players ADD COLUMN round_average_placement NUMERIC(4,2) DEFAULT 0.00;
        RAISE NOTICE 'Added round_average_placement column to players table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'round_win_rate') THEN
        ALTER TABLE players ADD COLUMN round_win_rate NUMERIC(5,2) DEFAULT 0.00;
        RAISE NOTICE 'Added round_win_rate column to players table';
    END IF;
END $$;

-- Add new columns to player_rankings table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'player_rankings') THEN
        -- League-level statistics
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'league_championships') THEN
            ALTER TABLE player_rankings ADD COLUMN league_championships INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added league_championships column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'league_runner_up') THEN
            ALTER TABLE player_rankings ADD COLUMN league_runner_up INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added league_runner_up column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'league_third_place') THEN
            ALTER TABLE player_rankings ADD COLUMN league_third_place INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added league_third_place column to player_rankings table';
        END IF;
        
        -- Round-level statistics
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'round_championships') THEN
            ALTER TABLE player_rankings ADD COLUMN round_championships INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added round_championships column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'round_runner_up') THEN
            ALTER TABLE player_rankings ADD COLUMN round_runner_up INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added round_runner_up column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'round_third_place') THEN
            ALTER TABLE player_rankings ADD COLUMN round_third_place INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added round_third_place column to player_rankings table';
        END IF;
        
        -- Game statistics
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'total_leagues') THEN
            ALTER TABLE player_rankings ADD COLUMN total_leagues INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added total_leagues column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'total_rounds') THEN
            ALTER TABLE player_rankings ADD COLUMN total_rounds INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added total_rounds column to player_rankings table';
        END IF;
        
        -- Average and win rate statistics
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'round_average_placement') THEN
            ALTER TABLE player_rankings ADD COLUMN round_average_placement NUMERIC(4,2) DEFAULT 0.00;
            RAISE NOTICE 'Added round_average_placement column to player_rankings table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'player_rankings' AND column_name = 'round_win_rate') THEN
            ALTER TABLE player_rankings ADD COLUMN round_win_rate NUMERIC(5,2) DEFAULT 0.00;
            RAISE NOTICE 'Added round_win_rate column to player_rankings table';
        END IF;
        
        RAISE NOTICE 'All columns added to player_rankings table successfully';
    ELSE
        RAISE NOTICE 'player_rankings table does not exist, skipping column additions';
    END IF;
END $$;
