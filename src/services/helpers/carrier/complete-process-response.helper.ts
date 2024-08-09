export default (name: string, carrierResponse: any = null) => {
  return {
    message: `Process completed successfully! Carrier ${name} created.`,
    nextStep: '',
    stepsDetails: {
      step: 'complete',
      stepTitle: 'We got it!',
      details1:
        "You are now ready to start making requests and integrating with your application. If you encounter any issues, don't hesitate to refer back to the tutorial or reach out to support.",
      details2: '',
      details3: '',
      details4: '',
    },
    form: {
      expectedFieldName: '',
      instruction:
        'You have the option to go to the dashboard to review existing information or create a new connector to add data.',
      label: '',
      title: 'Your connection has been successfully set up!',
      placeholder: '',
    },
    carrierResponse,
  };
};
