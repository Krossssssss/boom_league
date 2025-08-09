-- Simple migration to add missing fields to existing tables
-- Run this if you get "relation already exists" errors

-- Add missing columns to players table if they don't exist
DO $$ 
BEGIN
    -- Add total_games column to players table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'total_games') THEN
        ALTER TABLE players ADD COLUMN total_games INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added total_games column to players table';
    ELSE
        RAISE NOTICE 'total_games column already exists in players table';
    END IF;
    
    -- Add average_placement column to players table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'average_placement') THEN
        ALTER TABLE players ADD COLUMN average_placement NUMERIC(4,2) DEFAULT 0.00;
        RAISE NOTICE 'Added average_placement column to players table';
    ELSE
        RAISE NOTICE 'average_placement column already exists in players table';
    END IF;
    
    -- Add win_rate column to players table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'players' AND column_name = 'win_rate') THEN
        ALTER TABLE players ADD COLUMN win_rate NUMERIC(5,2) DEFAULT 0.00;
        RAISE NOTICE 'Added win_rate column to players table';
    ELSE
        RAISE NOTICE 'win_rate column already exists in players table';
    END IF;
END $$;

