import testServer from './index';
import router from '../../routes/shipment.routes';

const housebillNumber = 'D470100';
const carrier = 'dhl_global_forwarding';
const updatedShipment = { name: 'Updated Shipment', status: 'In Transit' };

jest.mock('../../controllers/shipment.controller', () => ({
  getAll: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipments retrieved successfully',
    data: ['shipment1', 'shipment2'],
  })),
  getByCarrier: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipments retrieved successfully',
    data: ['shipment-carrier1', 'shipment-carrier2'],
  })),
  getByCarrierAndId: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipments retrieved successfully',
    data: ['shipment-carrier-and-id'],
  })),
  getShipment: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Parsed shipment retrieved successfully',
    data: ['parsed-shipment'],
  })),
  updateByNumber: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'Shipment updated successfully',
    data: { number: housebillNumber, ...updatedShipment },
  })),
  deleteAll: jest.fn().mockImplementation(() => ({
    status: 200,
    message: 'All shipments deleted successfully',
  })),
  deleteByNumber: jest.fn().mockImplementation(() => ({
    status: 200,
    message: `Shipment ${housebillNumber} deleted successfully`,
  })),
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
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });

  it('Should return shipments with a certain carrier', async () => {
    const expected = ['shipment-carrier1', 'shipment-carrier2'];
    const response = await request.get(`/carrier/${carrier}`);
    expect(response.body).toHaveProperty(
      'message',
      'Shipments retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });

  it('Should return parsed shipment', async () => {
    const expected = ['shipment-carrier1', 'shipment-carrier2'];
    const response = await request.post(`/get-shipment`);
    expect(response.body).toHaveProperty(
      'message',
      'Parsed shipment retrieved successfully',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });

  it('Should update shipment by Housebill Number', async () => {
    const response = await request
      .put(`/number/${housebillNumber}`)
      .send(updatedShipment);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Shipment updated successfully',
    );
    expect(response.body.data).toEqual({
      number: housebillNumber,
      ...updatedShipment,
    });
  });

  it('Should delete all shipments', async () => {
    const response = await request.delete('/all');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'All shipments deleted successfully',
    );
  });

  it('Should delete shipment by ID', async () => {
    const response = await request.delete(`/number/${housebillNumber}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      `Shipment ${housebillNumber} deleted successfully`,
    );
  });
});
