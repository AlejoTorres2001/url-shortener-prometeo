/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ObjectId } from 'mongodb';
import { DeepPartial, MongoRepository } from 'typeorm';
import {
  BaseInterfaceRepository,
  ExtendedMongoFindManyOptions,
  ExtendedMongoFindOneOptions,
} from './interfaces/base.abstract.repository.interface';

interface HasId {
  id?: ObjectId;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  protected readonly repository: MongoRepository<T>;

  protected constructor(repository: MongoRepository<T>) {
    this.repository = repository;
  }

  public async save(data: T): Promise<T> {
    return await this.repository.save(data);
  }
  public async saveMany(data: T[]): Promise<T[]> {
    return await this.repository.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  public async findOneById(id: ObjectId): Promise<T> {
    if (!ObjectId.isValid(id.toString())) {
      throw new Error(`Invalid ObjectId: ${id.toString()}`);
    }
    const result = await this.repository.findOneBy({
      _id: new ObjectId(id),
    } as any);
    if (!result) {
      throw new Error(`Entity not found with id ${id.toString()}`);
    }
    return result;
  }

  public async findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError: true,
  ): Promise<T>;
  public async findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError: false,
  ): Promise<T | null>;
  public async findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError: boolean = true,
  ): Promise<T | null> {
    this.convertIdFilter(filterCondition.where);
    const result = await this.repository.findOne(filterCondition);
    if (!result && throwError) {
      throw new Error('Entity not found');
    }
    return result;
  }

  public async findAll(
    options?: ExtendedMongoFindManyOptions<T>,
  ): Promise<T[]> {
    if (options?.where) {
      this.convertIdFilter(options.where);
    }
    return this.repository.find(options);
  }

  public async remove(data: T): Promise<T> {
    const entityCopy = { ...data };
    const removeResult = await this.repository.remove(data);
    if (!removeResult) {
      throw new Error('Entity not found');
    }
    return { ...removeResult, id: entityCopy.id } as T;
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    const result = await this.repository.preload(entityLike);
    if (!result) {
      throw new Error('Entity not found');
    }
    return result;
  }
  private convertIdFilter(where: any): void {
    if (where && 'id' in where) {
      const idValue = where['id'];
      if (ObjectId.isValid(idValue)) {
        where['_id'] = new ObjectId(idValue);
        delete where['id'];
      } else {
        throw new Error(`Invalid ObjectId: ${idValue}`);
      }
    }
  }
}
