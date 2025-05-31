import { Entity, Column, PrimaryColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('users')
export class UserProfile {
  @PrimaryColumn()
  uuid!: string;

  @Column()
  @IsString()
  name!: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
