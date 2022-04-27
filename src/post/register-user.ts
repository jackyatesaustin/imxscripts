import yargs from 'yargs';
import { registerUser } from '../utils/postHelpers/register-user'

async function main(network: string, ownerPrivateKey: string):Promise<{tx_hash: string;}> {
  return await registerUser(network, ownerPrivateKey);
};

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network)
  .then(result => {
    console.log('Result: ' + result);
    console.log('Registration complete.');
    
  })
  .catch(err => {
    console.error('Registration failed.')
    console.error(err);
    process.exit(1);
  });
