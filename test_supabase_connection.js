// Test script to verify Supabase connection and data mapping
// Run with: node test_supabase_connection.js

const { createClient } = require('@supabase/supabase-js');

// Import configuration (adjust path as needed)
const SUPABASE_CONFIG = {
    url: 'https://gatiuwpldvmxeeraldue.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE'
};

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Data mapping functions (simplified versions)
const playerToSupabase = (player) => {
    const supabasePlayer = {};
    
    if (player.id !== undefined) supabasePlayer.id = player.id;
    if (player.app_id !== undefined) supabasePlayer.app_id = player.app_id;
    if (player.name !== undefined) supabasePlayer.name = player.name;
    if (player.avatar !== undefined) supabasePlayer.avatar = player.avatar;
    if (player.score !== undefined) supabasePlayer.score = player.score;
    if (player.history !== undefined) supabasePlayer.history = player.history;
    if (player.championships !== undefined) supabasePlayer.championships = player.championships;
    
    // camelCase to snake_case mapping
    if (player.runnerUp !== undefined) supabasePlayer.runner_up = player.runnerUp;
    if (player.thirdPlace !== undefined) supabasePlayer.third_place = player.thirdPlace;
    if (player.totalVP !== undefined) supabasePlayer.total_vp = player.totalVP;
    
    return supabasePlayer;
};

const playerFromSupabase = (supabasePlayer) => {
    return {
        id: supabasePlayer.id,
        app_id: supabasePlayer.app_id,
        name: supabasePlayer.name,
        avatar: supabasePlayer.avatar,
        score: supabasePlayer.score || 0,
        history: supabasePlayer.history || [],
        championships: supabasePlayer.championships || 0,
        // snake_case to camelCase mapping
        runnerUp: supabasePlayer.runner_up || 0,
        thirdPlace: supabasePlayer.third_place || 0,
        totalVP: supabasePlayer.total_vp || 0,
    };
};

async function testConnection() {
    console.log('🔌 Testing Supabase Connection...\n');
    
    try {
        // Test 1: Basic connection
        console.log('1. Testing basic connection...');
        const { data, error } = await supabase.from('players').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Connection successful!\n');
        
        // Test 2: Check table structure
        console.log('2. Checking table structures...');
        
        // Check players table
        const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select('*')
            .limit(1);
        
        if (playersError) {
            console.log('❌ Players table error:', playersError.message);
        } else {
            console.log('✅ Players table accessible');
            if (playersData && playersData.length > 0) {
                console.log('   Sample columns:', Object.keys(playersData[0]));
            }
        }
        
        // Check league_state table
        const { data: leagueData, error: leagueError } = await supabase
            .from('league_state')
            .select('*')
            .limit(1);
        
        if (leagueError) {
            console.log('❌ League state table error:', leagueError.message);
        } else {
            console.log('✅ League state table accessible');
            if (leagueData && leagueData.length > 0) {
                console.log('   Sample columns:', Object.keys(leagueData[0]));
            }
        }
        
        // Check league_history table
        const { data: historyData, error: historyError } = await supabase
            .from('league_history')
            .select('*')
            .limit(1);
        
        if (historyError) {
            console.log('❌ League history table error:', historyError.message);
        } else {
            console.log('✅ League history table accessible');
            if (historyData && historyData.length > 0) {
                console.log('   Sample columns:', Object.keys(historyData[0]));
            }
        }
        
        console.log('\n3. Testing data mapping...');
        
        // Test data mapping
        const testPlayer = {
            app_id: 'test-app',
            name: 'Test Player',
            avatar: '😼',
            score: 10,
            history: [{ round: 1, placement: 1 }],
            championships: 1,
            runnerUp: 2,
            thirdPlace: 1,
            totalVP: 25
        };
        
        const mappedToSupabase = playerToSupabase(testPlayer);
        const mappedFromSupabase = playerFromSupabase(mappedToSupabase);
        
        console.log('Original:', testPlayer);
        console.log('Mapped to Supabase:', mappedToSupabase);
        console.log('Mapped from Supabase:', mappedFromSupabase);
        
        // Verify mapping integrity
        const mappingCorrect = 
            testPlayer.runnerUp === mappedFromSupabase.runnerUp &&
            testPlayer.thirdPlace === mappedFromSupabase.thirdPlace &&
            testPlayer.totalVP === mappedFromSupabase.totalVP;
        
        if (mappingCorrect) {
            console.log('✅ Data mapping working correctly!');
        } else {
            console.log('❌ Data mapping has issues!');
        }
        
        console.log('\n🎉 Connection test completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run the migration SQL if you have existing data');
        console.log('   2. Or run the complete schema SQL for new setup');
        console.log('   3. Start your application with npm run dev');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your Supabase URL and API key');
        console.log('   2. Ensure your Supabase project is running');
        console.log('   3. Run the SQL schema files in Supabase');
        console.log('   4. Check Row Level Security policies');
    }
}

// Run the test
testConnection();
