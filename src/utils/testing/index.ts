import express, { Router } from 'express';
import supertest, { SuperTest, Test } from 'supertest';

function testServer(router: Router): SuperTest<Test> {
  const app = express();
  app.use(router);
  return supertest(app);
}

export default testServer;
