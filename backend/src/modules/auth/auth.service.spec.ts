import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { testDataSource } from '../../../db/test/data-source.test';

const user = {
  email: 'test@gmail.com',
  password: 'secret-password',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    await testDataSource.initialize();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDataSource.options),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({}),
      ],
      providers: [AuthService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should signup', async () => {
      const tokens = await service.signUp({
        email: user.email,
        password: user.password,
      });

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    // it('should throw on duplicate user signup', async () => {
    //   let tokens: Tokens | undefined;
    //   try {
    //     tokens = await authService.signupLocal({
    //       email: user.email,
    //       password: user.password,
    //     });
    //   } catch (error) {
    //     expect(error.status).toBe(403);
    //   }
    //
    //   expect(tokens).toBeUndefined();
    // });
  });

  afterAll(async () => {
    await testDataSource.dropDatabase();
  });
});
