import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiOkResponse({ description: 'Пользователь успешно зарегестрирован' })
  @ApiBody({ type: AuthDto })
  async signUp(@Res() res: Response, @Body() authDto: AuthDto) {
    const tokens = await this.authService.signUp(authDto);
    this.authService.setTokensInCookies(res, tokens);
    res.json({ status: 'success' });
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiOkResponse({ description: 'Пользователь успешно авторизован' })
  @ApiBody({ type: AuthDto })
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: string }> {
    const tokens = await this.authService.signIn(authDto);
    this.authService.setTokensInCookies(res, tokens);
    return { status: 'success' };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Логаут пользователя' })
  @ApiOkResponse({ description: 'Пользователь вышел из системы' })
  async logout(@Res() res: Response, @CurrentUserId() userId: string) {
    await this.authService.logout(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.sendStatus(HttpStatus.OK);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токенов пользователя' })
  @ApiOkResponse({ description: 'Токен успено обновлён' })
  async refreshTokens(
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: string }> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.authService.setTokensInCookies(res, tokens);
    return { status: 'success' };
  }
}
