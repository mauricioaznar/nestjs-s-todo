import request from 'supertest';
import { adminUser, normalUser } from '../objects/users';
import { INestApplication } from '@nestjs/common';

export async function getAdminToken(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/auth-program/login')
    .send({
      password: adminUser.password,
      email: adminUser.username,
    });

  const access_token = response.body.access_token;
  return { Authorization: `Bearer ${access_token}` };
}

export async function getSalesmanToken(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/auth-program/login')
    .send({
      password: normalUser.password,
      username: normalUser.username,
    });

  const access_token = response.body.access_token;
  return { Authorization: `Bearer ${access_token}` };
}
