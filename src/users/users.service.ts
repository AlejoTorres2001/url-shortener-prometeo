import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { UsersServiceInterface } from './users.service.interface';
import {
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
  UsersQueryDto,
} from './repositories/users.dto';
import { UserEntity } from './repositories/users.entity';
import { ObjectId } from 'mongodb';
import { UsersRepositoryInterface } from 'src/users/repositories/interfaces/users.repository.interface';
@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const newUser = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(newUser);
    return this.classMapper.map(savedUser, UserEntity, ReadUserDto);
  }
  async findAll({
    limit,
    offset,
    username,
  }: UsersQueryDto): Promise<ReadUserDto[]> {
    const foundUser = username
      ? await this.usersRepository.findAll({
          where: {
            username: { $regex: new RegExp(username, 'i') },
          },
          skip: offset,
          take: limit,
        })
      : await this.usersRepository.findAll({
          skip: offset,
          take: limit,
        });
    return this.classMapper.mapArray(foundUser, UserEntity, ReadUserDto);
  }
  async findOne(id: string): Promise<ReadUserDto> {
    const objectId = new ObjectId(id);
    const foundUser = await this.usersRepository.findOneById(objectId);
    return this.classMapper.map(foundUser, UserEntity, ReadUserDto);
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
    const updatedUser = await this.usersRepository.preload({
      id: new ObjectId(id),
      ...updateUserDto,
    });
    return this.classMapper.map(
      await this.usersRepository.save(updatedUser),
      UserEntity,
      ReadUserDto,
    );
  }
  async remove(id: string): Promise<ReadUserDto> {
    const objectId = new ObjectId(id);
    const foundUser = await this.usersRepository.findOneById(objectId);
    return this.classMapper.map(
      await this.usersRepository.remove(foundUser),
      UserEntity,
      ReadUserDto,
    );
  }
  async createMany(users: CreateUserDto[]): Promise<ReadUserDto[]> {
    const newUsers = this.usersRepository.createMany(users);
    return this.classMapper.mapArray(
      await this.usersRepository.saveMany(newUsers),
      UserEntity,
      ReadUserDto,
    );
  }
  async getUserByUserName(username: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findByCondition(
      {
        where: { username: { $eq: username } },
      },
      true,
    );
    return foundUser;
  }
  async getUserByEmail(email: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findByCondition(
      {
        where: { email: { $eq: email } },
      },
      true,
    );
    return foundUser;
  }
  async getUserById(userId: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOneById(
      new ObjectId(userId),
    );
    return foundUser;
  }
}
