const request = require('supertest');

const server = require('./server');
const db = require('../database/dbConfig');

beforeEach(async () => {
  await db('users').truncate();
});

describe('server', () => {
  it('runs test', () => {
    expect(true).toBe(true);
  });

  describe('GET /', () => {
    it('should return 200 ok ', () => {
      return request(server)
        .get('/')
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it('should return "up"', () => {
      return request(server)
        .get('/')
        .then(res => {
          expect(res.body.api).toBe('up');
        });
    });
  });

  describe('testing /api/auth endpoints post and get', () => {
    it.skip('sanity check', () => {
      return request(server)
        .get('/api/auth')
        .then(res => {
          expect(res.body.api).toBe('/api/auth');
        });
    });

    it('auth/register gives 201 status code', () => {
      const mockData = { username: 'aaron', password: 'wowowow' };
      return request(server)
        .post('/api/auth/register')
        .send(mockData)
        .then(res => {
          expect(res.status).toBe(201);
        });
    });

    it('auth/login checking for token ', async () => {
      const mockData = { username: 'aaron', password: 'wowowow' };
      // first we need to add a user to the db
      let res = await request(server)
        .post('/api/auth/register')
        .send(mockData);
      // then we can take mockdata login data
      expect(res.status).toBe(201);
      res = await request(server)
        .post('/api/auth/login')
        .send(mockData);
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(40);
      expect(res.status).toBe(200);
    });
  });
});
