import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies['access_token'],
      ]),
      secretOrKey: config.get('JWT_ACCESS'),
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    const { hashedRefreshToken } = await this.usersRepository.findOne({
      where: { email },
    });
    if (!hashedRefreshToken) throw new UnauthorizedException('Ошибка доступа');
    return payload;
  }
}
