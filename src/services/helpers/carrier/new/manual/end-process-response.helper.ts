export default (
  _name: string,
  isGetShipmentEndpoint: boolean,
  success: boolean,
  carrierResponse: any = null,
) => {
  return {
    //message: `Process completed successfully! Carrier ${name} created.`,
    isGetShipmentEndpoint,
    success,
    carrierResponse,
  };
};
