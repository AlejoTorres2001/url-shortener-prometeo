import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  NotFoundException,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ShortenerServiceInterface } from './interfaces/shortener.service.interface';
import {
  ApiResponseDto,
  createApiResponse,
} from 'src/core/dto/api-response.dto';

import {
  SHORTENER_FINDALL_CREATEDRESPONSE_DOC,
  SHORTENER_FINDALL_NOTFOUNDRESPONSE_DOC,
  SHORTENER_FINDALL_INTERNALERRORRESPONSE_DOC,
  SHORTENER_FINDONE_CREATEDRESPONSE_DOC,
  SHORTENER_FINDONE_NOTFOUNDRESPONSE_DOC,
  SHORTENER_FINDONE_INTERNALERRORRESPONSE_DOC,
  SHORTENER_CREATE_CREATEDRESPONSE_DOC,
  SHORTENER_CREATE_BADREQUESTRESPONSE_DOC,
  SHORTENER_CREATE_INTERNALERRORRESPONSE_DOC,
  SHORTENER_REMOVE_CREATEDRESPONSE_DOC,
  SHORTENER_REMOVE_NOTFOUNDRESPONSE_DOC,
  SHORTENER_REMOVE_INTERNALERRORRESPONSE_DOC,
} from './shortener.swagger';
import {
  CreateShortenerDto,
  CreateShortenerInputDto,
  ReadShortenerDto,
  ShortenerQueryDto,
  UpdateShortenerDto,
} from './repository/shortener.dtos';
import { GetCurrentUser } from 'src/auth/decorators';

@ApiTags('shortener')
@ApiExtraModels(
  ReadShortenerDto,
  CreateShortenerDto,
  UpdateShortenerDto,
  ApiResponseDto,
)
@ApiBearerAuth('access_token')
@Controller('/api/shortener')
export class ShortenerController {
  constructor(
    @Inject('ShortenerServiceInterface')
    private readonly shortenerService: ShortenerServiceInterface,
  ) {}

  @ApiCreatedResponse(SHORTENER_FINDALL_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(SHORTENER_FINDALL_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(SHORTENER_FINDALL_INTERNALERRORRESPONSE_DOC)
  @Get()
  async findAll(
    @Query() query: ShortenerQueryDto,
    @Res() res: Response,
  ): Promise<Response> {
    const items = await this.shortenerService.findAll(query);
    if (items.length === 0) {
      throw new NotFoundException(`No URLs found for query.`);
    }
    return res
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'URLs retrieved successfully', items));
  }

  @ApiCreatedResponse(SHORTENER_FINDONE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(SHORTENER_FINDONE_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(SHORTENER_FINDONE_INTERNALERRORRESPONSE_DOC)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the shortened URL',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const item = await this.shortenerService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Shortened URL with ID ${id} not found.`);
    }
    return res
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'URL retrieved successfully', item));
  }

  @ApiCreatedResponse(SHORTENER_CREATE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(SHORTENER_CREATE_BADREQUESTRESPONSE_DOC)
  @ApiInternalServerErrorResponse(SHORTENER_CREATE_INTERNALERRORRESPONSE_DOC)
  @Post()
  async create(
    @Body() dto: CreateShortenerInputDto,
    @Res() res: Response,
    @GetCurrentUser('userId') userId: string,
  ): Promise<Response> {
    const created = await this.shortenerService.create({
      originalUrl: dto.originalUrl,
      userId,
    });
    return res
      .status(HttpStatus.CREATED)
      .json(createApiResponse(true, 'URL shortened successfully', created));
  }
  @ApiCreatedResponse(SHORTENER_REMOVE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(SHORTENER_REMOVE_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(SHORTENER_REMOVE_INTERNALERRORRESPONSE_DOC)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the shortened URL',
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const removed = await this.shortenerService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Shortened URL with ID ${id} not found.`);
    }
    return res
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'URL deleted successfully', removed));
  }
}
