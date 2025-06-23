import { getSchemaPath } from '@nestjs/swagger';
import { ReadUserDto } from './repositories/users.dto';
import { ApiResponseDto } from 'src/core/dto/api-response.dto';

// USER_FIND_ALL Responses
export const USER_FINDALL_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(ReadUserDto) },
          },
        },
      },
    ],
  },
  description: 'Users retrieved successfully',
};

export const USER_FINDALL_NOTFOUNDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'NOT_FOUND' },
        },
      },
    ],
  },
  description: 'No users found',
};

export const USER_FINDALL_INTERNALERRORRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
        },
      },
    ],
  },
  description: 'Internal server error',
};

// USER_FIND_ONE Responses
export const USER_FINDONE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadUserDto) },
        },
      },
    ],
  },
  description: 'User retrieved successfully',
};

export const USER_FINDONE_NOTFOUNDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'NOT_FOUND' },
        },
      },
    ],
  },
  description: 'User not found',
};

export const USER_FINDONE_INTERNALERRORRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
        },
      },
    ],
  },
  description: 'Internal server error',
};

// USER_UPDATE Responses
export const USER_UPDATE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadUserDto) },
        },
      },
    ],
  },
  description: 'User updated successfully',
};

export const USER_UPDATE_NOTFOUNDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'NOT_FOUND' },
        },
      },
    ],
  },
  description: 'User not found',
};

export const USER_UPDATE_INTERNALERRORRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
        },
      },
    ],
  },
  description: 'Internal server error',
};

// USER_REMOVE Responses
export const USER_REMOVE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadUserDto) },
        },
      },
    ],
  },
  description: 'User deleted successfully',
};

export const USER_REMOVE_NOTFOUNDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'NOT_FOUND' },
        },
      },
    ],
  },
  description: 'User not found',
};

export const USER_REMOVE_INTERNALERRORRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
        },
      },
    ],
  },
  description: 'Internal server error',
};
