import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const userDto: AuthDto = {
  login: 'adas@gmail.com',
  password: '12345',
};

describe('AuthController, /login (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login - Success', async () => {
    const responce = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(responce.body.accessToken).toBeDefined();
  });

  it('/auth/login - Fail (email)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...userDto, login: 'adas1f@gmail.com' })
      .expect(401, {
        message: 'User is not found!',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/login - Fail (password)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...userDto, password: '1' })
      .expect(401, {
        message: 'Email or password is not correct!',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });
});
