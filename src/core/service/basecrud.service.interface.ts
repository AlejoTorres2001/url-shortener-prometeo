export interface BaseCrudServiceInterface<
  TCreateDto,
  TReadDto,
  TUpdateDto,
  TQueryDto,
> {
  create(createDto: TCreateDto): Promise<TReadDto>;
  findAll(queryDto: TQueryDto): Promise<TReadDto[]>;
  findOne(id: string): Promise<TReadDto>;
  update(id: string, updateDto: TUpdateDto): Promise<TReadDto>;
  remove(id: string): Promise<TReadDto>;
  createMany(createDto: TCreateDto[]): Promise<TReadDto[]>;
}
