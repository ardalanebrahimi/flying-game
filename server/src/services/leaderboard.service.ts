import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { LeaderboardEntry } from '../models/leaderboard-entry';

@Service()
export class LeaderboardService {
    constructor(
        @Inject('typeorm.repository.LeaderboardEntry')
        private repository: Repository<LeaderboardEntry>
    ) {}

    async getAll(): Promise<LeaderboardEntry[]> {
        return this.repository.find({
            order: {
                score: 'DESC'
            }
        });
    }

    async addScore(entry: LeaderboardEntry): Promise<void> {
        await this.repository.save(entry);
    }
}
