import testServer from './index';
import router from '../../routes/carrier.routes';

const carrierId = 'global forwarding';
const newCarrier = {
  endpoints: {},
  name: 'example',
  userId: 'admin',
};

jest.mock('../../controllers/carrier.controller', () => ({
  getAll: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Carriers retrieved successfully',
    data: ['carrier1', 'carrier2'],
  })),
  getById: jest.fn().mockImplementation(() => ({
    status: 200,
    message: `Carrier with ID ${carrierId} retrieved successfully`,
    data: ['carrier-id1', 'carrier-id2'],
  })),
  createKnown: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Carrier created successfully',
    data: newCarrier,
  })),
  createNew: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Carrier created successfully',
    data: newCarrier,
  })),
  endSession: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Session ended successfully',
  })),
  deleteAll: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'All carriers deleted successfully',
  })),
  deleteByNumber: jest.fn().mockImplementation(() => ({
    status: 200,
    message: `Carrier with ID ${carrierId} deleted successfully`,
  })),
}));

const request = testServer(router);

describe('[routes / carriers]', () => {
  it('Should return all carriers', async () => {
    const expected = ['carrier1', 'carrier2'];
    const response = await request.get('/');
    expect(response.body).toHaveProperty(
      'message',
      'Carriers retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });
});

describe('[routes / carriers]', () => {
  it('Should return carriers with a certain ID', async () => {
    const expected = ['carrier-id1', 'carrier-id2'];
    const response = await request.get(`/id/${carrierId}`);
    expect(response.body).toHaveProperty(
      'message',
      'Carrier retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });
});

describe('[routes / carriers]', () => {
  it('Should create new carrier', async () => {
    const response = await request.post(`/known`).send(newCarrier);
    expect(response.body).toHaveProperty(
      'message',
      'Carrier retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(newCarrier);
  });
});

describe('[routes / carriers]', () => {
  it('Should create new carrier', async () => {
    const response = await request.post(`/new`).send(newCarrier);
    expect(response.body).toHaveProperty(
      'message',
      'Carrier retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(newCarrier);
  });
});

describe('[routes / carriers]', () => {
  it('Should end session', async () => {
    const response = await request.get(`/end-session`);
    expect(response.body).toHaveProperty(
      'message',
      'Session ended successfully',
    );
    expect(response.status).toBe(200);
  });
});

describe('[routes / carriers]', () => {
  it('Should delete all carriers', async () => {
    const response = await request.delete(`/all`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      `All carriers deleted successfully`,
    );
  });
});

describe('[routes / carriers]', () => {
  it('Should delete carrier based on ID', async () => {
    const response = await request.delete(`/id/${carrierId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      `Carrier with ID ${carrierId} deleted succesffully`,
    );
  });
});
