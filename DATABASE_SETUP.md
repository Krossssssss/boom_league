# Boom League Tournament Tracker - Database Setup

This document explains how to set up the Supabase database for the Boom League Tournament Tracker application.

## 📊 Database Overview

The application uses 3 main tables:

1. **`players`** - Stores player profiles, stats, and game history
2. **`league_state`** - Stores current active league state and configuration  
3. **`league_history`** - Stores completed league records for historical tracking

## 🆕 New Database Setup

If you're setting up a **new** Supabase project, use the complete schema:

### Step 1: Run the Complete Schema
```sql
-- Copy and paste the entire contents of supabase_tables.sql
-- into your Supabase SQL editor and execute
```

This will create:
- ✅ All 3 tables with proper structure
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Triggers for automatic timestamps
- ✅ Sample data (optional)
- ✅ Views for common queries

## 🔄 Existing Database Migration

If you **already have** `players` and `league_state` tables, use the migration script:

### Step 1: Run the Migration Script
```sql
-- Copy and paste the entire contents of supabase_migration.sql  
-- into your Supabase SQL editor and execute
```

This will:
- ✅ Add missing columns to existing tables
- ✅ Create the `league_history` table
- ✅ Add indexes, triggers, and policies
- ✅ Preserve all your existing data

## 📋 Table Structures

### Players Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `app_id` | TEXT | Application identifier |
| `name` | TEXT | Player name |
| `avatar` | TEXT | Player emoji avatar |
| `score` | INTEGER | Current league score |
| `history` | JSONB | Game history array |
| `championships` | INTEGER | Number of championships won |
| `runner_up` | INTEGER | Number of runner-up finishes |
| `third_place` | INTEGER | Number of third place finishes |
| `total_vp` | INTEGER | Total VP earned across all leagues |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### League State Table  
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `app_id` | TEXT | Application identifier (unique) |
| `status` | TEXT | League status (setup/pending_confirmation/in_progress/finished) |
| `current_round` | INTEGER | Current round number |
| `schedule` | JSONB | Round configurations array |
| `winner` | JSONB | Winner information object |
| `league_name` | TEXT | League name |
| `season_number` | INTEGER | Season number |
| `start_date` | TIMESTAMP | League start date |
| `end_date` | TIMESTAMP | League end date |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |
| `selected_special_rules` | JSONB | Selected special rules array |

### League History Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `app_id` | TEXT | Application identifier |
| `league_name` | TEXT | League name |
| `season_number` | INTEGER | Season number |
| `start_date` | TIMESTAMP | League start date |
| `end_date` | TIMESTAMP | League end date |
| `winner` | JSONB | Winner information object |
| `final_standings` | JSONB | Final player standings array |
| `total_rounds` | INTEGER | Total rounds played |
| `total_players` | INTEGER | Total players participated |
| `created_at` | TIMESTAMP | Record creation time |

## 🔒 Security Configuration

Both SQL files set up Row Level Security (RLS) with anonymous access policies. This allows the application to work without authentication.

### Current Policies
- **Anonymous users can**: SELECT, INSERT, UPDATE, DELETE on all tables
- **Suitable for**: Development and private tournaments
- **Production note**: Consider implementing proper authentication and user-based policies

### To Modify Security
```sql
-- Example: Restrict to authenticated users only
DROP POLICY "Allow anonymous read access on players" ON players;
CREATE POLICY "Authenticated users only" ON players USING (auth.role() = 'authenticated');
```

## 📊 Useful Views

The setup includes a `player_rankings` view with calculated statistics:

```sql
SELECT * FROM player_rankings;
-- Returns: id, name, score, total_vp, total_games, average_placement, win_rate, etc.
```

## 🔍 Verification Queries

After running the setup, verify everything is working:

```sql
-- Check table structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('players', 'league_state', 'league_history')
ORDER BY table_name, ordinal_position;

-- Check sample data (if inserted)
SELECT COUNT(*) as player_count FROM players;
SELECT COUNT(*) as league_count FROM league_state;
SELECT COUNT(*) as history_count FROM league_history;

-- Test the rankings view
SELECT name, score, total_vp, total_games FROM player_rankings LIMIT 5;
```

## 🚀 Application Configuration

Make sure your application's Supabase configuration matches your database:

```typescript
// app/constants/supabase.ts
export const SUPABASE_CONFIG = {
    supabaseUrl: 'your-project-url',
    supabaseAnonKey: 'your-anon-key'
};
```

## 📝 JSON Field Formats

### Player History Format
```json
[
  {"round": 1, "placement": 2},
  {"round": 2, "placement": 1},
  {"round": 3, "placement": 3}
]
```

### League Schedule Format
```json
[
  {
    "round": 1,
    "safeCards": 12,
    "bombCards": 4,
    "handLimit": 5,
    "vpMode": {"name": "5分局 (5/3/1)", "scores": [5, 3, 1, 0, 0, 0]},
    "specialRule": "无特殊规则"
  }
]
```

### Winner Format
```json
{
  "name": "Alice",
  "avatar": "😼", 
  "reason": "在第 3 轮率先达到 12 分！"
}
```

### Selected Special Rules Format
```json
[
  "无特殊规则",
  "手牌明牌",
  "禁止携带 Skip"
]
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure RLS policies are set up correctly
   - Check your Supabase project settings

2. **Column Not Found**
   - Run the migration script if upgrading from old schema
   - Check column names match exactly (snake_case in DB, camelCase in TypeScript)

3. **JSONB Errors**
   - Ensure JSON data is properly formatted
   - Use `'[]'::jsonb` for empty arrays, not just `'[]'`

### TypeScript Mapping

Note the naming differences between TypeScript and SQL:
- TypeScript: `runnerUp` → SQL: `runner_up`
- TypeScript: `thirdPlace` → SQL: `third_place`  
- TypeScript: `totalVP` → SQL: `total_vp`

The application handles this mapping automatically.

## 🎯 Next Steps

After setting up the database:

1. ✅ Run your application
2. ✅ Test player registration
3. ✅ Start a league and play some rounds
4. ✅ Check that data is being saved correctly
5. ✅ Verify league history is created when leagues finish

Your Boom League Tournament Tracker database is now ready! 🎮
