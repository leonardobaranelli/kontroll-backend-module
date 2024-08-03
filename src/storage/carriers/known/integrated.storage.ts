export const integrated = [
  {
    name: 'dhl global forwarding',
    query: 1,
    url: 'https://api.dhl.com/dgff/transportation/shipment-tracking',
    method: 'get',
    requeriments: {
      params: {
        shipmentID: 'value',
      },
      header: {
        'DHL-API-Key': 'value',
      },
      body: {},
    },
  },
  {
    name: 'dhl express',
    query: 1,
    url: 'https://xmlpi-ea.dhl.com/XMLShippingServlet?isUTF8Support=true',
    method: 'post',
    requeriments: {
      params: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Charset': 'utf-8',
        futureDate: false,
      },
      body: {
        xlm: 'value',
      },
    },
  },
];
