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

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
  UsersQueryDto,
} from 'src/users/repositories/users.dto';
import { UsersServiceInterface } from 'src/users/users.service.interface';
import {
  USER_FINDALL_CREATEDRESPONSE_DOC,
  USER_FINDALL_NOTFOUNDRESPONSE_DOC,
  USER_FINDALL_INTERNALERRORRESPONSE_DOC,
  USER_FINDONE_CREATEDRESPONSE_DOC,
  USER_FINDONE_NOTFOUNDRESPONSE_DOC,
  USER_FINDONE_INTERNALERRORRESPONSE_DOC,
  USER_UPDATE_CREATEDRESPONSE_DOC,
  USER_UPDATE_NOTFOUNDRESPONSE_DOC,
  USER_UPDATE_INTERNALERRORRESPONSE_DOC,
  USER_REMOVE_CREATEDRESPONSE_DOC,
  USER_REMOVE_NOTFOUNDRESPONSE_DOC,
  USER_REMOVE_INTERNALERRORRESPONSE_DOC,
} from './users.swagger';
import { Response } from 'express';
import {
  ApiResponseDto,
  createApiResponse,
} from 'src/core/dto/api-response.dto';
@ApiTags('users')
@ApiExtraModels(ReadUserDto, CreateUserDto, UpdateUserDto, ApiResponseDto)
@ApiBearerAuth('access_token')
@Controller('/api/users')
export class UsersController {
  constructor(
    @Inject('UsersServiceInterface')
    private readonly usersService: UsersServiceInterface,
  ) {}

  @ApiCreatedResponse(USER_FINDALL_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(USER_FINDALL_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(USER_FINDALL_INTERNALERRORRESPONSE_DOC)
  @Get()
  async findAll(
    @Query() pagination: UsersQueryDto,
    @Res() response: Response,
  ): Promise<Response> {
    const foundUsers = await this.usersService.findAll(pagination);
    if (foundUsers.length === 0) {
      throw new NotFoundException(
        `User with username like  ${pagination.username} not found.`,
      );
    }
    return response
      .status(HttpStatus.OK)
      .json(
        createApiResponse(true, 'Users retrieved successfully', foundUsers),
      );
  }

  @ApiCreatedResponse(USER_FINDONE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(USER_FINDONE_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(USER_FINDONE_INTERNALERRORRESPONSE_DOC)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Id of the User',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Id of the User',
  })
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const foundUser = await this.usersService.findOne(id);
    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return response
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'User retrieved successfully', foundUser));
  }

  @ApiCreatedResponse(USER_UPDATE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(USER_UPDATE_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(USER_UPDATE_INTERNALERRORRESPONSE_DOC)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Id of the user',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ): Promise<Response> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return response
      .status(HttpStatus.CREATED)
      .json(createApiResponse(true, 'User updated successfully', updatedUser));
  }

  @ApiCreatedResponse(USER_REMOVE_CREATEDRESPONSE_DOC)
  @ApiNotFoundResponse(USER_REMOVE_NOTFOUNDRESPONSE_DOC)
  @ApiInternalServerErrorResponse(USER_REMOVE_INTERNALERRORRESPONSE_DOC)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Id of the user',
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const removedUser = await this.usersService.remove(id);

    if (!removedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return response
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'User deleted successfully', removedUser));
  }
}
