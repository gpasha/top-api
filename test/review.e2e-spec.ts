import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Product',
  description: 'Nice product for you',
  rating: 5,
  productId,
};

const userDto: AuthDto = {
  login: 'adas@gmail.com',
  password: '12345',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    token = body.access_token;
  });

  it('/review/create (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createdId = response.body._id;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) - fail (not valid incoming data)', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);

    console.log('response.body: ', response.body);
  });

  it('/review/byProduct/:productId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body[0]._id).toBe(createdId);
  });

  it('/review/byProduct/:productId (GET) - Fail', async () => {
    const response = await request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(0);
  });

  it('/review/:id (DELETE)', () => {
    request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/review/:id (DELETE) - Fail', () => {
    request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });
});
