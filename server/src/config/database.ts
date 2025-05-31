import { DataSource } from 'typeorm';
import { Container } from 'typedi';
import { LeaderboardEntry } from '../models/leaderboard-entry';
import { UserProfile } from '../models/user-profile';

// Create TypeORM data source
export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [LeaderboardEntry, UserProfile],
    synchronize: true,
    logging: true
});

// Initialize database
export const initializeDatabase = async () => {
    try {
        const connection = await AppDataSource.initialize();
        
        // Set TypeORM's Repository type to be retrieved from TypeDI Container
        Container.set('typeorm.connection', connection);
        Container.set('typeorm.entitymanager', connection.manager);
        
        // Register repositories
        Container.set('typeorm.repository.LeaderboardEntry', connection.getRepository(LeaderboardEntry));
        Container.set('typeorm.repository.UserProfile', connection.getRepository(UserProfile));
        
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
};
