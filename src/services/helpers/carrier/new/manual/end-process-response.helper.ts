export default (
  _name: string,
  isGetShipmentEndpoint: boolean,
  isAuthEndpoint: boolean,
  success: boolean,
  carrierResponse: any = null,
  location?: string,
  value?: string,
) => {
  return {
    isGetShipmentEndpoint,
    isAuthEndpoint,
    success,
    carrierResponse,
    location,
    value,
  };
};
