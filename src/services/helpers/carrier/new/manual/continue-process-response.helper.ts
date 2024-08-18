export default (
  isGetShipmentEndpoint: boolean,
  success: boolean,
  carrierResponse: any = null,
) => {
  return {
    isGetShipmentEndpoint,
    success,
    carrierResponse,
  };
};
