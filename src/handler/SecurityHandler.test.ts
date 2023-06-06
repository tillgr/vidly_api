import { server } from '..';
import request from 'supertest';
import { User } from 'model';

describe('SecurityHandler', () => {
  const agent = request(server);
  let token: string;

  const exec = () => {
    return agent
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    server.close();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();

    expect(res.status).toBe(400);
  });
});
