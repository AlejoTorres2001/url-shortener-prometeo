import { getSchemaPath } from '@nestjs/swagger';
import { SignInOutput, Tokens } from './auth.dto';
import { ReadUserDto } from 'src/users/repositories/users.dto';
import { ApiResponseDto } from 'src/core/dto/api-response.dto';

// AUTH_SIGNUP_LOCAL Responses
export const AUTH_SIGNUP_SUCCESSRESPONSE_DOC = {
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
  description: 'User signed up successfully',
};

export const AUTH_SIGNUP_CONFLICTRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
          success: { type: 'boolean', example: false },
          errorCode: { type: 'string', example: 'CONFLICT' },
        },
      },
    ],
  },
  description: 'Username already exists',
};

export const AUTH_SIGNUP_INTERNALERRORRESPONSE_DOC = {
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

// AUTH_SIGNIN_LOCAL Responses
export const AUTH_SIGNIN_SUCCESSRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(SignInOutput) },
        },
      },
    ],
  },
  description: 'User signed in successfully',
};

export const AUTH_SIGNIN_INTERNALERRORRESPONSE_DOC = {
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

// AUTH_LOGOUT Responses
export const AUTH_LOGOUT_SUCCESSRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { type: 'null' },
        },
      },
    ],
  },
  description: 'Logged out successfully',
};

export const AUTH_LOGOUT_INTERNALERRORRESPONSE_DOC = {
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

// AUTH_REFRESH_TOKENS Responses
export const AUTH_REFRESH_TOKENS_SUCCESSRESPONSE_DOC = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(Tokens) },
        },
      },
    ],
  },
  description: 'Tokens refreshed successfully',
};

export const AUTH_REFRESH_TOKENS_INTERNALERRORRESPONSE_DOC = {
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
