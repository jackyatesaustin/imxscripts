import dotenv from 'dotenv';
import yargs from 'yargs';
import { getClient } from '../client';
dotenv.config();

export async function registerUser(ownerPrivateKey?: string)
  : Promise<{tx_hash: string;}> {
    const client = await getClient(ownerPrivateKey);
    let result = await client.registerImx({
      etherKey: client.address.toLowerCase(),
      starkPublicKey: client.starkPublicKey
    });
    return result;
  }
/**
 * Register a wallet on IMX.
 */
async function main(ownerPrivateKey: string) {
  let result = registerUser(ownerPrivateKey)
  return result
};

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <wallet_private_key>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
  })
  .parseSync();

main(argv.k)
  .then(result => {
    console.log('Registration complete.');
    console.log(result);
  })
  .catch(err => {
    console.error('Registration failed.')
    console.error(err);
    process.exit(1);
  });
