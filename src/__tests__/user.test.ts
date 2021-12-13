import { INestApplication } from '@nestjs/common';
import { setupApp } from './factories/setup-app';
import request from 'supertest';

describe('Users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  describe('Login', () => {
    it('user logs in', async () => {
      const username = 'maria';
      const password = 'changeme';
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(
              loginInput: {username: "${username}", password: "${password}"}) 
                { 
                  accessToken  
                }
              }`,
        });

      expect(response.body.data.login.accessToken).toBeDefined();
    });
  });
});
