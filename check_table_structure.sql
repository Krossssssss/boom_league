-- Check current table structure for players and player_rankings tables

-- Check players table structure
SELECT 
    'players' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'players'
ORDER BY ordinal_position;

-- Check player_rankings table structure (if it exists)
SELECT 
    'player_rankings' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'player_rankings'
ORDER BY ordinal_position;

-- Check if tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'DOES NOT EXIST'
    END as status
FROM information_schema.tables 
WHERE table_name IN ('players', 'player_rankings');

-- Check specific columns we need
SELECT 
    'Required columns check' as info,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'players' AND column_name = 'total_games'
    ) THEN 'players.total_games: EXISTS' 
    ELSE 'players.total_games: MISSING' END as players_total_games,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'players' AND column_name = 'average_placement'
    ) THEN 'players.average_placement: EXISTS' 
    ELSE 'players.average_placement: MISSING' END as players_avg_placement,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'players' AND column_name = 'win_rate'
    ) THEN 'players.win_rate: EXISTS' 
    ELSE 'players.win_rate: MISSING' END as players_win_rate;

-- Check player_rankings specific columns
SELECT 
    'player_rankings columns check' as info,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_rankings' AND column_name = 'total_games'
    ) THEN 'player_rankings.total_games: EXISTS' 
    ELSE 'player_rankings.total_games: MISSING' END as rankings_total_games,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_rankings' AND column_name = 'average_placement'
    ) THEN 'player_rankings.average_placement: EXISTS' 
    ELSE 'player_rankings.average_placement: MISSING' END as rankings_avg_placement,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_rankings' AND column_name = 'win_rate'
    ) THEN 'player_rankings.win_rate: EXISTS' 
    ELSE 'player_rankings.win_rate: MISSING' END as rankings_win_rate;
