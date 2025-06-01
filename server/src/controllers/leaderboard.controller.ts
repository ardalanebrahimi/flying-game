import {
  JsonController,
  Get,
  Post,
  Body,
  HttpCode,
  OnUndefined,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LeaderboardEntry } from '../models/leaderboard-entry';
import { LeaderboardService } from '../services/leaderboard.service';

@JsonController('/leaderboard')
@Service()
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('/')
  @OpenAPI({
    summary: 'Get the leaderboard',
    description: 'Returns the highest score for each player, sorted by score',
  })
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getAll();
  }

  @Post('/')
  @HttpCode(201)
  @OnUndefined(201)
  @OpenAPI({
    summary: 'Add score to leaderboard',
    description: 'Adds a new score entry to the leaderboard',
  })
  async addScore(@Body() entry: LeaderboardEntry): Promise<void> {
    await this.leaderboardService.addScore(entry);
  }
}
