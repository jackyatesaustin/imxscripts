#!/usr/bin/env node
import yargs from 'yargs';
import { AddMetadataSchemaToCollectionResult, AddMetadataSchemaToCollectionParams, MetadataTypes } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

require('dotenv').config();

async function addMetadataSchemaToCollection(ownerPrivateKey: string, tokenAddress: string, schema: AddMetadataSchemaToCollectionParams, network: string): Promise<AddMetadataSchemaToCollectionResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.addMetadataSchemaToCollection(tokenAddress, schema);
}

async function main(ownerPrivateKey: string, tokenAddress: string, schema: AddMetadataSchemaToCollectionParams, network: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await addMetadataSchemaToCollection(ownerPrivateKey, tokenAddress, schema, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

/**
 * Edit your values here
 */
 const schema: AddMetadataSchemaToCollectionParams = {
    metadata: [
      {
        name: "eco",
        type: MetadataTypes.Text
      },
      {
        name: "name",
        type: MetadataTypes.Text
      },
      {
        name: "pgn",
        type: MetadataTypes.Text
      },      
      {
        name: "FEN",
        type: MetadataTypes.Text
      },
      {
        name: "image_url",
        type: MetadataTypes.Text
      }
    ],
};

main(argv.k, argv.s, schema, argv.network)
  .then(() => console.log('Metadata schema updated'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });