export const getUsEastProvider = () => {
  return new aws.Provider('us-east-1', {
    region: aws.Region.USEast1,
  });
};
