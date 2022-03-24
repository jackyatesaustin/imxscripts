import dotenv from 'dotenv';
import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { getClient } from '../client';
dotenv.config();

/**
 * Register a wallet on IMX.
 */
async function main(ownerPrivateKey: string, walletAddress: string) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ROPSTEN_ETH_PROVIDER_URL);
  const owner: Wallet = new ethers.Wallet(ownerPrivateKey).connect(provider);
  const immutableXClient = await getClient(owner);
  let result = await immutableXClient.registerImx({
    etherKey: walletAddress.toLowerCase(),
    starkPublicKey: immutableXClient.starkPublicKey
  });
  return result;
};

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -f <wallet_private_key> -a <wallet_address>')
  .options({
    f: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'wallet address', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.a)
  .then(result => {
    console.log('Registration complete.');
    console.log(result);
  })
  .catch(err => {
    console.error('Registration failed.')
    console.error(err);
    process.exit(1);
  });
