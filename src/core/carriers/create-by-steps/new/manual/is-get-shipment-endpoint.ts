interface UserInput {
  shipmentId?: string;
}

export default (state: any) => {
  state.userInputs?.map((userInput: UserInput) => {
    userInput.shipmentId
      ? console.log(`${userInput.shipmentId}`.blue)
      : console.log('Shipment Id not found'.blue);
  });

  return true;
};
