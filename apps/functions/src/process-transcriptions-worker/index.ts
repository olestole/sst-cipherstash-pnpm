import { getEqlClient, getLockContext } from '@db/lib/eql';
import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from 'aws-lambda';

type CtsToken = {
  accessToken: string;
  expiry: number;
};

type ProcessTranscriptionEventRecord = {
  input: {
    myInput: string;
  };
  ctx: {
    userId: string;
    ctsToken: CtsToken;
  };
};

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  // Have to return errors in a specific format to enable retries in SQS
  // https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html
  const batchItemFailures: SQSBatchItemFailure[] = [];

  // Add messageId to the record to be able to track which record failed
  const records = event.Records.map((record) => ({
    ...JSON.parse(record.body),
    messageId: record.messageId,
  }));

  try {
    const results = await Promise.allSettled(
      records.map(async (record) => {
        try {
          await processTranscriptionRecord(record);
        } catch (error) {
          throw record.messageId;
        }
      }),
    );

    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) => {
        batchItemFailures.push({
          // The reason is the messageId of the record that failed
          itemIdentifier: result.reason,
        });
      });

    return { batchItemFailures };
  } catch (error) {
    console.error('Error processing records', error);
    throw error;
  }
};

const processTranscriptionRecord = async (record: ProcessTranscriptionEventRecord) => {
  const userId = record.ctx.userId;
  if (!userId) {
    console.error('No user ID found');
    throw new Error('No user ID found');
  }

  const ctsToken = record.ctx.ctsToken;
  if (!ctsToken) {
    console.error('No CTS token found. Unable to decrypt data');
    throw new Error('No CTS token found. Unable to decrypt data');
  }

  const [eqlClient, lockContext] = await Promise.all([getEqlClient(), getLockContext(ctsToken)]);

  console.log('eqlClient', eqlClient);
  console.log('lockContext', lockContext);
  // TODO: Use the eqlClient and lockContext to decrypt/re-encrypt the data
};
