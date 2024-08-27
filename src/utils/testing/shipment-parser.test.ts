import testServer from './index';
import router from '../../routes/shipment-parser.routes';

const carrierName = 'dhl_global_forwarding';
const trackingId = 'BOGA06663';

jest.mock('../../controllers/shipment-parser.controller', () => ({
  parseShipmentEntry: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment parsed successfully',
  })),
  parseShipmentWithAI: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'ShipmentParserController.parseShipmentWithAi started',
  })),
  parseShipmentWithMemory: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment parsed successfully',
  })),
  saveParsedShipment: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment successfully saved in database',
  })),
  testMechanicalParser: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'ShipmentParserController.testMechanicalParser started',
  })),
}));

const request = testServer(router);

describe('[routes /shipment-parser]', () => {
  it('Should parse shipment', async () => {
    const response = await request.get(`/parse/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Shipment parsed successfully');
  });

  it('Should parse shipment with AI', async () => {
    const response = await request.get(`/ai-parse/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'ShipmentParserController.parseShipmentWithAi started');
  });

  it('Should parse shipment with memory', async () => {
    const response = await request.get(`/memory-parse/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Shipment parsed successfully');
  });

  it('Should save shipment', async () => {
    const response = await request.get(`/save/${carrierName}/${trackingId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Shipment successfully saved in database');
  });

  it('Should test mechanical parser', async () => {
    const response = await request.post(`/test-mechanical-parser`).send({
      input: {}, // Provide necessary input for the test
      output: {}, // Provide necessary output for the test
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'ShipmentParserController.testMechanicalParser started');
  });
});
