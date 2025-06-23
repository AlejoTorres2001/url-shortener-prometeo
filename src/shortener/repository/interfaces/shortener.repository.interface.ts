import { BaseInterfaceRepository } from "src/core/repositories/interfaces/base.abstract.repository.interface";
import { ShortenerEntity } from "../shortener.entity";


export interface ShortenerRepositoryInterface extends BaseInterfaceRepository<ShortenerEntity> {
  exists(shortCode: string): Promise<boolean>;
}