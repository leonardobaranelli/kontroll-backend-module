export default (
  isGetShipmentEndpoint: boolean,
  isAuthEndpoint: boolean,
  success: boolean,
  carrierResponse: any = null,
) => {
  return {
    isGetShipmentEndpoint,
    isAuthEndpoint,
    success,
    carrierResponse,
  };
};
