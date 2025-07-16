import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { NotFoundError } from 'routing-controllers';
import { UserProfile } from '../models/user-profile';
import { randomUUID } from 'crypto';

@Service()
export class UserService {
  constructor(
    @Inject('typeorm.repository.UserProfile')
    private repository: Repository<UserProfile>
  ) {}

  async getById(uuid: string): Promise<UserProfile> {
    const profile = await this.repository.findOne({ where: { uuid } });
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  async create(profile: UserProfile): Promise<string> {
    const uuid = randomUUID();
    const newProfile = this.repository.create({
      ...profile,
      uuid,
    });
    await this.repository.save(newProfile);
    return uuid;
  }

  async update(uuid: string, profile: UserProfile): Promise<void> {
    const existing = await this.repository.findOne({ where: { uuid } });
    if (!existing) {
      throw new NotFoundError('User profile not found');
    }
    await this.repository.update(uuid, { ...profile, updatedAt: new Date() });
  }

  async delete(uuid: string): Promise<void> {
    const result = await this.repository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundError('User profile not found');
    }
  }
}
