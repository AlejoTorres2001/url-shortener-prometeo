import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { AutoMap } from '@automapper/classes';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';

@Entity({
  name: 'users',
})
export class UserEntity {
  @ObjectIdColumn()
  @AutoMap()
  id: ObjectId;

  @Column({ unique: true })
  @AutoMap()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  @AutoMap()
  email: string;

  @Column({ select: false })
  @AutoMap()
  password: string;

  @Column({ nullable: true, default: '' })
  @AutoMap()
  refreshToken: string;
  @BeforeUpdate()
  async hashRefreshToken() {
    if (this.refreshToken) {
      this.refreshToken = await argon2.hash(this.refreshToken);
    }
  }
  @CreateDateColumn()
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    return await argon2.verify(this.refreshToken, refreshToken);
  }
}
