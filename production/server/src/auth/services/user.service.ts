import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
// import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: 'changeme',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'mod',
      password: 'guess',
      role: 'mod',
    },
    {
      userId: 3,
      username: 'user',
      password: 'guess',
      role: 'user',
    },
  ];

  async findOne(username: string): Promise<any> {
    return this.users.find((user: any) => user.username === username);
  }
}
