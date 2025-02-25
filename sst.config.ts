/// <reference path="./.sst/platform/config.d.ts" />
// NOTE: Never import at the top of the sst.config. It has to be imported within the config

export default $config({
  app(input) {
    return {
      name: 'journalia-cipherstash-debug',
      removal: input?.stage !== 'journalia-cipherstash-debug' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          profile: 'journalia-cipherstash-debug',
        },
      },
    };
  },

  async run() {
    // NOTE: Have to import within the $config function in order to have access to `$app`
    const { configureQueue } = await import('./infra/queue');
    const processTranscriptionQueue = configureQueue();
    const vpc = new sst.aws.Vpc('MyVpc', { bastion: true, nat: 'ec2' });

    const processTranscriptionWorker = new sst.aws.Function('ProcessTranscriptionWorker', {
      vpc,
      handler: 'apps/functions/src/process-transcriptions-worker/index.handler',
      runtime: 'nodejs20.x',
      description: 'Processes transcriptions from the transcription queue',
      timeout: '5 minutes',
      permissions: [
        {
          // AWSLambdaSQSQueueExecutionRole
          actions: [
            'sqs:ReceiveMessage',
            'sqs:DeleteMessage',
            'sqs:GetQueueAttributes',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          resources: ['*'],
        },
      ],
      nodejs: {
        esbuild: {
          external: [
            '@cipherstash/jseql',
            // '@cipherstash/jseql-ffi',
            // '@cipherstash/jseql-ffi-linux-x64-gnu',
          ],
          // format: 'cjs',
          // packages: 'external',
        },
      },
      // copyFiles: [
      //   {
      //     from: 'node_modules/@cipherstash/jseql',
      //     to: 'node_modules/@cipherstash/jseql',
      //   },
      //   {
      //     from: 'node_modules/@cipherstash/jseql-ffi',
      //     to: 'node_modules/@cipherstash/jseql-ffi',
      //   },
      //   {
      //     from: 'node_modules/@cipherstash/jseql-ffi-linux-x64-gnu',
      //     to: 'node_modules/@cipherstash/jseql-ffi-linux-x64-gnu',
      //   },
      // ],
    });

    processTranscriptionQueue.subscribe(processTranscriptionWorker.arn);
  },
});
