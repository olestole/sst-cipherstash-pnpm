import { eql, LockContext as LockContextCipherStash } from '@cipherstash/jseql';

export type EqlPayload =
  | (Record<string, string> & {
      c: string; // Ciphertext
    })
  | null;

export type EqlPayloadBulk =
  | (Record<string, string> & {
      c: string; // Ciphertext
      id: string;
    })[]
  | null;

export type CipherStashConfig = {
  workspaceId: string;
  clientId: string;
  clientKey: string;
  accessToken: string;
  zeroKmsHost: string;
  configPath?: string;
};

export type EqlClient = Awaited<ReturnType<typeof eql>>;

export type LockContext = LockContextCipherStash;
