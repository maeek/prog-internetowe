import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'employee1' })
  username: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: 'user' })
  role: 'user' | 'admin';
}
