import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../jwt.payload.interface';
import { EnvironmentService } from 'src/core/environment/environment.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly environmentService: EnvironmentService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environmentService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  validate(payload: JWTPayload): JWTPayload {
    return payload;
  }
}
