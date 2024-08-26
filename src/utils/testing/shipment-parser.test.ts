import testServer from './index';
import router from '../../routes/shipment-parser.routes';

const carrierName = 'dhl_global_forwarding';
const trackingId = 'BOGA06663';

jest.mock('../../controllers/shipment-parser.controller', () => ({
  parseShipmentEntry: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment parsed successfulñy',
  })),
  saveParsedShipment: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment successfully saved in database',
  })),
}));

const request = testServer(router);

describe('[routes /shipment-parser]', () => {
  it('Should parse shipment', async () => {
    const response = await request.get(`/parse/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      `Shipment parsed successfully`,
    );
  });
});

describe('[routes /shipment-parser]', () => {
  it('Should save shipment', async () => {
    const response = await request.get(`/save/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      `Shipment successfully saved in database`,
    );
  });
});
