#!/usr/bin/env node
import yargs from 'yargs';
import { UpdateMetadataSchemaByNameParams, MetadataTypes, UpdateMetadataSchemaByNameResult } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

require('dotenv').config();

async function updateMetadataSchemaByName(ownerPrivateKey: string, tokenAddress: string, name: string, schema: UpdateMetadataSchemaByNameParams, network: string): Promise<UpdateMetadataSchemaByNameResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.updateMetadataSchemaByName(name, tokenAddress, schema);
}

async function main(ownerPrivateKey: string, tokenAddress: string, name: string, schema: UpdateMetadataSchemaByNameParams, network: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await updateMetadataSchemaByName(ownerPrivateKey, tokenAddress, name, schema, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -s <SMART_CONTRACT_ADDRESS> -n <NAME> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    n: { describe: 'name of metadata schema', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

/**
 * Edit your values here
 */
 const schema: UpdateMetadataSchemaByNameParams = {
        name: 'EXAMPLE_BOOLEAN_UPDATED',
        type: MetadataTypes.Boolean,
        filterable: true,
        // ..add rest of schema here
};

main(argv.k, argv.s, argv.n, schema, argv.network)
  .then(() => console.log('Metadata schema updated'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });