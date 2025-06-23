import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { ShortenerServiceInterface } from 'src/shortener/interfaces/shortener.service.interface';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { Response } from 'express';
import { Public } from 'src/auth/decorators';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  API_REDIRECT_BADREQUEST_DOC,
  API_REDIRECT_INTERNALERROR_DOC,
  API_REDIRECT_NOTFOUND_DOC,
} from './api.swagger';
@ApiTags('URL Redirects 🔀')
@Controller()
export class ApiController {
  constructor(
    @Inject('ShortenerServiceInterface')
    private readonly shortenerService: ShortenerServiceInterface,
    private readonly environmentService: EnvironmentService,
  ) {}
  @ApiOperation({
    summary: '🔀 Redirect to original URL',
    description:
      'Takes a short code and redirects the user to the original destination URL',
  })
  @ApiParam({
    name: 'shortCode',
    type: String,
    required: true,
    description: 'Short code part of the shortened URL',
    example: 'abc123',
  })
  @ApiBadRequestResponse(API_REDIRECT_BADREQUEST_DOC)
  @ApiNotFoundResponse(API_REDIRECT_NOTFOUND_DOC)
  @ApiInternalServerErrorResponse(API_REDIRECT_INTERNALERROR_DOC)
  @Public()
  @Get('/:shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!shortCode) {
      throw new BadRequestException('Short code is required');
    }
    const baseUrl = this.environmentService.get<string>(
      this.environmentService.get<string>('STAGE') === 'DEV'
        ? 'DEV_SHORTENER_BASE_URL'
        : 'PROD_SHORTENER_BASE_URL',
    );
    const shortUrl = `${baseUrl.replace(/\/+$/, '')}/${shortCode}`;

    const dto = await this.shortenerService.resolve(shortUrl);

    //!Redirect
    return res.redirect(dto.originalUrl);
  }
}
