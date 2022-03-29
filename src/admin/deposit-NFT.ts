#!/usr/bin/env node
import yargs from 'yargs';
import { ethers } from 'ethers';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

require('dotenv').config();

/**
 * Deposit an NFT into L2 from L1, remember it has to already be registered
 */
 async function depositNFT(ownerPrivateKey: string, tokenId: string, smartContractAddress: string, network: string): Promise<string> {
  const client = await getClient(network, ownerPrivateKey);
  return await client.deposit({
    user: client.address,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: smartContractAddress
      }
    },
    quantity: ethers.BigNumber.from('1')
  })
}

async function main(ownerPrivateKey: string, tokenid: string, tokenaddress:string, network:string) {
    const response = await depositNFT(ownerPrivateKey, tokenid, tokenaddress, network);
    console.log(`NFT deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <wallet_private_key> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.network)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });