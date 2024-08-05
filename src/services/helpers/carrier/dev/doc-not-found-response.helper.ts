export default (name: string) => {
  return {
    message: `Documentation not found for carrier ${name}.`,
    nextStep: '',
    stepsDetails: {
      step: 'step2',
      stepTitle: `No documentation found for carrier ${name}!`,
      details1: `No documentation found for carrier ${name}.`,
      details2: '',
      details3: '',
      details4: '',
    },
    form: {
      expectedFieldName: '',
      instruction: `No documentation found for carrier ${name}.`,
      label: '',
      title:
        'Your connection has not been set up, because the documentation not found!',
      placeholder: '',
    },
  };
};
