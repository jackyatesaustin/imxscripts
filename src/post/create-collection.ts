#!/usr/bin/env node
import yargs from 'yargs';
import { CreateCollectionsResult } from '@imtbl/imx-sdk';
import { getClient, getSigner } from '../utils/client';

require('dotenv').config();

async function createCollection(ownerPrivateKey: string, tokenAddress: string, name: string, project_id: number, network: string, metadata_api_url?: string, description?: string, icon_url?: string, collection_image_url?: string): Promise<CreateCollectionsResult> {
    const client = await getClient(network, ownerPrivateKey);
    const signer = await getSigner(network, ownerPrivateKey);
    return client.createCollection ({
        name: name,
        contract_address: tokenAddress,
        owner_public_key: signer.publicKey,
        project_id: project_id,
        metadata_api_url: metadata_api_url,
        description: description,
        icon_url: icon_url,
        collection_image_url: collection_image_url
    })
}

async function main(ownerPrivateKey: string, tokenAddress: string, name: string, project_id: number, network: string, metadata_api_url?: string, description?: string, icon_url?: string, collection_image_url?: string): Promise<void> {
    // Transfer the token to the administrator
    const result = await createCollection(ownerPrivateKey, tokenAddress, name, project_id, network, metadata_api_url, description, icon_url, collection_image_url);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -s <SMART_CONTRACT_ADDRESS> -n <NAME> -p <PROJECT_ID> -m <METADATA_API_URL> -d <DESCRIPTION> -i <ICON_URL> -o <COLLECTION_IMAGE_URL> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    n: { describe: 'name', type: 'string', demandOption: true },
    p: { describe: 'project id', type: 'number', demandOption: true },
    m: { describe: 'metadata api url', type: 'string', demandOption: false },
    d: { describe: 'description', type: 'string', demandOption: false },
    i: { describe: 'icon url', type: 'string', demandOption: false },
    o: { describe: 'collection image url', type: 'string', demandOption: false },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.s, argv.n, argv.p, argv.network, argv.m, argv.d, argv.i, argv.o)
  .then(() => console.log('Collection created'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });