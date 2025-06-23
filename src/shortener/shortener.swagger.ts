// src/shortener/shortener.swagger.ts

import { getSchemaPath } from '@nestjs/swagger';
import { ReadShortenerDto } from './repository/shortener.dtos';
import { ApiResponseDto } from 'src/core/dto/api-response.dto';

// SHORTENER_FIND_ALL Responses
export const SHORTENER_FINDALL_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(ReadShortenerDto) },
          },
        },
      },
    ],
  },
  description: 'Shortened URLs retrieved successfully',
};

export const SHORTENER_FINDALL_NOTFOUNDRESPONSE_DOC = {
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
  description: 'No shortened URLs found',
};

export const SHORTENER_FINDALL_INTERNALERRORRESPONSE_DOC = {
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

// SHORTENER_FIND_ONE Responses
export const SHORTENER_FINDONE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadShortenerDto) },
        },
      },
    ],
  },
  description: 'Shortened URL retrieved successfully',
};

export const SHORTENER_FINDONE_NOTFOUNDRESPONSE_DOC = {
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
  description: 'Shortened URL not found',
};

export const SHORTENER_FINDONE_INTERNALERRORRESPONSE_DOC = {
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

// SHORTENER_CREATE Responses
export const SHORTENER_CREATE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadShortenerDto) },
        },
      },
    ],
  },
  description: 'URL shortened successfully',
};

export const SHORTENER_CREATE_BADREQUESTRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'BAD_REQUEST' },
        },
      },
    ],
  },
  description: 'Invalid URL or domain not allowed',
};

export const SHORTENER_CREATE_INTERNALERRORRESPONSE_DOC = {
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
// SHORTENER_REMOVE Responses
export const SHORTENER_REMOVE_CREATEDRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(ReadShortenerDto) },
        },
      },
    ],
  },
  description: 'Shortened URL deleted successfully',
};

export const SHORTENER_REMOVE_NOTFOUNDRESPONSE_DOC = {
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
  description: 'Shortened URL not found',
};

export const SHORTENER_REMOVE_INTERNALERRORRESPONSE_DOC = {
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
