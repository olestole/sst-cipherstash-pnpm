export const configureQueue = () => {
  const queue = new sst.aws.Queue('ProcessTranscriptionQueue', {
    // dlq - Set up a Dead letter queue in order to handle failed messages
    visibilityTimeout: '5 minutes',
  });

  return queue;
};
