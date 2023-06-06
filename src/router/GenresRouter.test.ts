import { server } from '..';
import request from 'supertest';
import { Genre, User } from 'model';

describe('GenresRouter', () => {
  const agent = request(server);

  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      const payload = [{ name: 'genre1' }, { name: 'genre2' }];
      await Genre.insertMany(payload);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      payload.forEach((item) => {
        expect(
          res.body.some((genre: Genre) => genre.name === item.name)
        ).toBeTruthy();
      });
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });
    it('should return 404 if valid id is passed', async () => {
      const res = await request(server).get(`/api/genres/1`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token: string;
    let name: string;

    const exec = () => {
      return agent
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name });
      expect(genre).not.toBeNull();
    });
    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', name);
    });
  });
});
