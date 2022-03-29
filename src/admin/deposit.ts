#!/usr/bin/env node
import yargs from 'yargs';
import { ethers } from 'ethers';
import { ETHTokenType, ERC721TokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

require('dotenv').config();

/**
 * Deposit Eth from L1 into IMX (L2) for a single wallet. The environment
 * used in the deposit depends on the settings in the getClient call, and
 * the Eth provider used.
 */
async function depositETH(ownerPrivateKey: string, amount: string, network: string): Promise<string> {
  const token = {
    type: ETHTokenType.ETH,
    data: {
      decimals: 18,
    }
  }
  const client = await getClient(network, ownerPrivateKey);
  const quantity = ethers.utils.parseEther(amount);
  return await client.deposit({
    user: await client.address,
    token,
    quantity
  });
}

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

async function main(ownerPrivateKey: string, network:string, amount?: string, tokenid?: string, tokenaddress?:string) {
  let response = '';
  if(tokenid && tokenaddress) {
    response = await depositNFT(ownerPrivateKey, tokenid, tokenaddress, network);
    console.log('deposit NFT')
    console.log(`NFT deposit Tx: ${JSON.stringify(response)}`);
  } 
  else if(amount && !tokenid && !tokenaddress)
  {
    response = await depositETH(ownerPrivateKey, amount, network);
    console.log('deposit ETH')
    console.log(`ETH deposit Tx: ${JSON.stringify(response)}`);
  }
  else {
    response = "Missing either the amount in an ETH deposit or ";
    console.log(response)
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <wallet_private_key> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: false },
    t: { describe: 'token id', type: 'string', demandOption: false },
    s: { describe: 'smart contract address', type: 'string', demandOption: false},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network, argv.a, argv.t, argv.s)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });