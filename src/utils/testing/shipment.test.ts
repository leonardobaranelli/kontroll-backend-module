import testServer from './index';
import router from '../../routes/shipment.routes';

jest.mock('../../services/shipment.service', () => ({
  getAllShipments: jest.fn(() => Promise.resolve(['shipment1', 'shipment2'])),
}));

const request = testServer(router);

describe('[routes / shipments]', () => {
  it('Should return all shipments', async () => {
    const expected = ['shipment1', 'shipment2'];
    const response = await request.get('/');
    expect(response.body).toHaveProperty(
      'message',
      'Shipments retrieved successfully',
    );
    expect(response.body.data).toEqual(expected);
  });
});
