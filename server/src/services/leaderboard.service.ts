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
    const query = this.repository
      .createQueryBuilder('entry')
      .select('entry.playerName', 'playerName')
      .addSelect('MAX(entry.score)', 'score')
      .groupBy('entry.playerName')
      .orderBy('score', 'DESC');

    return query.getRawMany();
  }

  async addScore(entry: LeaderboardEntry): Promise<void> {
    await this.repository.save(entry);
  }
}
