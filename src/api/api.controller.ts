import { BadRequestException, Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { ShortenerServiceInterface } from 'src/shortener/interfaces/shortener.service.interface';
import { EnvironmentService } from 'src/core/environment/environment.service';
import { Response } from 'express';
import { Public } from 'src/auth/decorators';

@Controller()
export class ApiController {
  constructor(
    @Inject('ShortenerServiceInterface')
    private readonly shortenerService: ShortenerServiceInterface,
    private readonly environmentService: EnvironmentService,
  ) {}
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

    // Obtenemos la entidad con originalUrl
    const dto = await this.shortenerService.resolve(shortUrl);

    // Redirigimos al cliente
    return res.redirect(dto.originalUrl);
  }
}
