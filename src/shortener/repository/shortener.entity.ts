import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  Index,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { AutoMap } from '@automapper/classes';

@Entity({
  name: 'urls'
})
export class ShortenerEntity {
  @ObjectIdColumn()
  @AutoMap()
  id: ObjectId;

  @Column()
  @AutoMap()
  @Index({ unique: true, background: true })
  originalUrl: string;

  @Column()
  @AutoMap()
  shortCode: string;
  
  @Column()
  @AutoMap()
  @Index({ unique: true, background: true })
  shortUrl: string;

  @Column()
  @AutoMap()
  userId: string;

  @CreateDateColumn()
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn()
  @AutoMap()
  updatedAt: Date;
}
