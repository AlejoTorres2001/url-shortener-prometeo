import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './repositories/users.entity';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { DBConnectionsEnum } from 'src/core/environment/interfaces/environment.service.interface';
import { UsersProfile } from './repositories/users.profiles';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], DBConnectionsEnum.BACKEND)],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'UsersServiceInterface',
      useClass: UsersService,
    },
    UsersProfile,
  ],
  exports: ['UsersServiceInterface'],
})
export class UsersModule {}
