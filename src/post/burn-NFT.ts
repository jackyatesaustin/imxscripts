#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ERC721TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Transfer a token from one user to another.
 */
async function burnNFT(ownerPrivateKey: string, tokenId: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableBurnResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.burn({
      sender: client.address,
        token: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenId: tokenId,
                tokenAddress: tokenAddress
            }
        },
    quantity: ethers.BigNumber.from(1),
});
}

async function main(ownerPrivateKey: string, tokenid: string, tokenaddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await burnNFT(ownerPrivateKey, tokenid, tokenaddress, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.network)
  .then(() => console.log('NFT Burn Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
