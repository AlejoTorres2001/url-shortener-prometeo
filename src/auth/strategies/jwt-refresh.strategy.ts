import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWTPayload } from '../jwt.payload.interface';
import { EnvironmentService } from 'src/core/environment/environment.service';

const jwtRefreshTokenExtractor = (req: Request): string | null => {
  if (req && req.cookies && req.cookies['refresh_token']) {
    return req.cookies['refresh_token'];
  } else if (req && req.headers && req.headers['authorization']) {
    return (req.headers['authorization'] as string).replace('Bearer ', '');
  } else if (req && req.body && req.body['refresh_token']) {
    return req.body['refresh_token'] as string;
  }
  return null;
};
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly environmentService: EnvironmentService) {
    super({
      jwtFromRequest: jwtRefreshTokenExtractor,
      secretOrKey: environmentService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    const refreshToken = jwtRefreshTokenExtractor(req);
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return { ...payload, refreshToken };
  }
}
