import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNumber, Min } from 'class-validator';

@Entity('leaderboard')
export class LeaderboardEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  playerName!: string;

  @Column()
  @IsNumber()
  @Min(0)
  score!: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
