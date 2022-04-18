#!/usr/bin/env node

import yargs from 'yargs';
import { ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Mint a token to the given user.
 */
 async function mintV2(ownerPrivateKey: string, tokenId: string, tokenAddress: string, bluePrint: string, receiver: string, network: string, royalties?: any[]) 
 : Promise<ImmutableMethodResults.ImmutableOffchainMintV2Results> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.mintV2([{
        users: [{
            etherKey: receiver.toLowerCase(),
            tokens: [{
                id: tokenId,
                blueprint: bluePrint,
                royalties: royalties
            }]
        }],
        contractAddress: tokenAddress
    }]);
}

async function main(ownerPrivateKey: string, tokenId: string, tokenAddress: string, bluePrint: string, receiver: string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await mintV2(ownerPrivateKey, tokenId, tokenAddress, bluePrint, receiver, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -b <BLUEPRINT> -r <RECEIVER_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    b: { describe: 'blueprint', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.b, argv.r, argv.network)
  .then(() => console.log('Token minted'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });