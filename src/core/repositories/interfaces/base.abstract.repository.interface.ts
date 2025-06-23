import { DeepPartial, FindOperator } from 'typeorm';
import { ObjectId } from 'mongodb';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';

// Utility type to add MongoDB operators
type MongoDBQueryOperators<T> = {
  $eq?: T;
  $ne?: T;
  $lt?: T;
  $lte?: T;
  $gt?: T;
  $gte?: T;
  $in?: T[];
  $nin?: T[];
  $regex?: RegExp;
  $exists?: boolean;
  $type?: string;
};
export type MongoFindOptionsWhere<T> = {
  [P in keyof T]?:
    | T[P]
    | MongoDBQueryOperators<T[P]>
    | ObjectId
    | FindOperator<Date>; // Add ObjectId type to the union
};

export interface ExtendedMongoFindOneOptions<T>
  extends Omit<MongoFindOneOptions<T>, 'where'> {
  where?: MongoFindOptionsWhere<T>;
}

export interface ExtendedMongoFindManyOptions<T>
  extends Omit<MongoFindManyOptions<T>, 'where'> {
  where?: MongoFindOptionsWhere<T>;
}

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: T): Promise<T>;
  saveMany(data: T[]): Promise<T[]>;
  findOneById(id: ObjectId): Promise<T>;
  findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError: true,
  ): Promise<T>;
  findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError: false,
  ): Promise<T | null>;
  findByCondition(
    filterCondition: ExtendedMongoFindOneOptions<T>,
    throwError?: boolean,
  ): Promise<T | null>;
  findAll(options?: ExtendedMongoFindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
