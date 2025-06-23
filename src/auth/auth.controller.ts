import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiHeaders,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiExtraModels,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, ReadUserDto } from 'src/users/repositories/users.dto';
import { LoginDTO, SignInOutput, Tokens } from './auth.dto';
import {
  AUTH_SIGNUP_SUCCESSRESPONSE_DOC,
  AUTH_SIGNUP_CONFLICTRESPONSE_DOC,
  AUTH_SIGNUP_INTERNALERRORRESPONSE_DOC,
  AUTH_SIGNIN_SUCCESSRESPONSE_DOC,
  AUTH_SIGNIN_INTERNALERRORRESPONSE_DOC,
  AUTH_LOGOUT_SUCCESSRESPONSE_DOC,
  AUTH_LOGOUT_INTERNALERRORRESPONSE_DOC,
  AUTH_REFRESH_TOKENS_SUCCESSRESPONSE_DOC,
  AUTH_REFRESH_TOKENS_INTERNALERRORRESPONSE_DOC,
} from './auth.swagger';
import { GetCurrentUser, Public } from './decorators';
import { createApiResponse } from 'src/core/dto/api-response.dto';
import { RefreshTokenGuard } from './guards';
import { EnvironmentService } from 'src/core/environment/environment.service';
@ApiTags('Authentication 🔐')
@ApiExtraModels(LoginDTO, SignInOutput, Tokens)
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly environmentService: EnvironmentService,
  ) {}
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account with the provided credentials',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration information',
    required: true,
  })
  @ApiCreatedResponse(AUTH_SIGNUP_SUCCESSRESPONSE_DOC)
  @ApiConflictResponse(AUTH_SIGNUP_CONFLICTRESPONSE_DOC)
  @ApiInternalServerErrorResponse(AUTH_SIGNUP_INTERNALERRORRESPONSE_DOC)
  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ReadUserDto> {
    try {
      return await this.authService.signUpLocal(createUserDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates an user and returns access and refresh tokens',
  })
  @ApiBody({
    type: LoginDTO,
    description: 'User login credentials',
    required: true,
  })
  @ApiOkResponse(AUTH_SIGNIN_SUCCESSRESPONSE_DOC)
  @ApiInternalServerErrorResponse(AUTH_SIGNIN_INTERNALERRORRESPONSE_DOC)
  @Public()
  @Post('local/signin')
  async signInLocal(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const responseData: SignInOutput =
      await this.authService.signInLocal(loginDTO);
    response.cookie('refresh_token', responseData.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.environmentService.get<string>('STAGE') === 'PROD',
      domain:
        this.environmentService.get<string>('STAGE') === 'PROD'
          ? this.environmentService.get<string>('PROD_APP_DOMAIN')
          : this.environmentService.get<string>('DEV_APP_DOMAIN'),
      maxAge:
        this.environmentService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') *
        1000,
    });
    response
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'Successfully signed in', responseData));
  }
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidates current session and clears authentication tokens',
  })
  @ApiOkResponse(AUTH_LOGOUT_SUCCESSRESPONSE_DOC)
  @ApiInternalServerErrorResponse(AUTH_LOGOUT_INTERNALERRORRESPONSE_DOC)
  @ApiBearerAuth('access_token')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer access_token',
    },
  ])
  @Post('logout')
  async logout(
    @GetCurrentUser('userId') userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(userId);
    response.clearCookie('refresh_token', { httpOnly: true });
    response
      .status(HttpStatus.OK)
      .json(createApiResponse(true, 'Logged out successfully'));
  }
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Issues new access and refresh tokens using a valid refresh token',
  })
  @ApiOkResponse(AUTH_REFRESH_TOKENS_SUCCESSRESPONSE_DOC)
  @ApiInternalServerErrorResponse(AUTH_REFRESH_TOKENS_INTERNALERRORRESPONSE_DOC)
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer refresh_token',
    },
  ])
  @ApiBearerAuth('refresh_token')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('userId') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens: Tokens = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.environmentService.get<string>('STAGE') === 'PROD',
      domain:
        this.environmentService.get<string>('STAGE') === 'PROD'
          ? this.environmentService.get<string>('PROD_APP_DOMAIN')
          : this.environmentService.get<string>('DEV_APP_DOMAIN'),
      maxAge:
        this.environmentService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') *
        1000,
    });
    response.status(HttpStatus.OK).json(
      createApiResponse(true, 'Tokens refreshed successfully', {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      }),
    );
  }
}
