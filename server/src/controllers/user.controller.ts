import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  OnUndefined,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { UserProfile } from '../models/user-profile';
import { UserService } from '../services/user.service';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:uuid')
  @OpenAPI({
    summary: 'Get user profile',
    description: 'Returns the user profile for the given UUID',
  })
  async getUserProfile(@Param('uuid') uuid: string): Promise<UserProfile> {
    return this.userService.getById(uuid);
  }

  @Put('/:uuid')
  @OnUndefined(200)
  @OpenAPI({
    summary: 'Update user profile',
    description: 'Updates an existing user profile',
  })
  async updateUserProfile(
    @Param('uuid') uuid: string,
    @Body() profile: UserProfile
  ): Promise<void> {
    await this.userService.update(uuid, profile);
  }

  @Post('/')
  @OnUndefined(201)
  @OpenAPI({
    summary: 'Create user profile',
    description: 'Creates a new user profile',
  })
  async createUserProfile(@Body() profile: UserProfile): Promise<string> {
    return this.userService.create(profile);
  }

  @Delete('/:uuid')
  @OnUndefined(204)
  @OpenAPI({
    summary: 'Delete user profile',
    description: 'Deletes an existing user profile',
  })
  async deleteUserProfile(@Param('uuid') uuid: string): Promise<void> {
    await this.userService.delete(uuid);
  }
}
