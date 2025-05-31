import { AppDataSource } from './config/database';
import { LeaderboardEntry } from './models/leaderboard-entry';
import { UserProfile } from './models/user-profile';

async function exploreDatabase() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('Connected to database!');

    // Get repositories
    const leaderboardRepo = AppDataSource.getRepository(LeaderboardEntry);
    const userRepo = AppDataSource.getRepository(UserProfile);

    // Get all leaderboard entries
    console.log('\n--- Leaderboard Entries ---');
    const leaderboard = await leaderboardRepo.find({
      order: { score: 'DESC' },
    });
    console.table(leaderboard);

    // Get all user profiles
    console.log('\n--- User Profiles ---');
    const users = await userRepo.find();
    console.table(users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
  }
}

// Run the explorer
exploreDatabase();
