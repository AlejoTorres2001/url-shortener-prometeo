import { getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/core/dto/api-response.dto';
export const API_REDIRECT_BADREQUEST_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'BAD_REQUEST' },
          message: { type: 'string', example: 'Short code is required' },
        },
      },
    ],
  },
  description: 'Bad request - Short code is missing or invalid',
};

export const API_REDIRECT_INTERNALERROR_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
          message: { type: 'string', example: 'Failed to resolve the short URL' },
        },
      },
    ],
  },
  description: 'Internal server error - Failed to resolve the short URL',
};

export const API_REDIRECT_NOTFOUND_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'NOT_FOUND' },
          message: { type: 'string', example: 'Short URL not found' },
        },
      },
    ],
  },
  description: 'The requested short URL does not exist',
};