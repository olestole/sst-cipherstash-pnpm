import { CtsToken, eql, LockContext } from '@cipherstash/jseql';

/**
 * The initialization of the EQL client requires the following env to be loaded:
 * CS_WORKSPACE_ID, CS_CLIENT_ID, CS_CLIENT_KEY, CS_CLIENT_ACCESS_KEY, CS_ZEROKMS_HOST, CS_CONFIG_PATH (optional)
 *
 * This cannot be passed as construction parameters
 */
export const getEqlClient = async () => {
  return eql();
};

export const getLockContext = async (ctsToken: CtsToken) => {
  return new LockContext({
    ctsToken,
  });
};
