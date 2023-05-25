import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload.type';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(authDto: AuthDto): Promise<Tokens> {
    const { email } = authDto;

    const candidate = await this.usersRepository.findOne({ where: { email } });
    if (candidate) {
      throw new BadRequestException(
        'Пользователь с такими данными уже существует',
      );
    }

    const hashedPassword = await this.hashData(authDto.password);
    const newUser = await this.usersRepository.create({
      email: email,
      hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.usersRepository.save(newUser);

    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signIn(authDto: AuthDto): Promise<Tokens> {
    const user = await this.usersRepository.findOne({
      where: { email: authDto.email },
    });
    if (!user) throw new ForbiddenException('Не верные данные');

    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.hashedPassword,
    );
    if (!passwordMatches) throw new ForbiddenException('Не верные данные');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (user && user.hashedRefreshToken !== null) {
      user.hashedRefreshToken = null;
      await this.usersRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Не верные данные');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Не верные данные');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.usersRepository.update(userId, { hashedRefreshToken: hash });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_ACCESS'),
        expiresIn: '1m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_REFRESH'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  setTokensInCookies(response: Response, tokens: Tokens) {
    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      path: '/auth/refresh',
      sameSite: 'lax',
    });
  }
}
