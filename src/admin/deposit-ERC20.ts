#!/usr/bin/env node
import yargs from 'yargs';
import { ethers } from 'ethers';
import { ERC20TokenType } from '@imtbl/imx-sdk';
import { getClient } from '../client';

require('dotenv').config();

/**
 * Deposit ERC20 into L2 from L1, remember it has to already be registered and whitelisted
 */
 async function depositERC20(ownerPrivateKey: string, decimals: number, symbol: string, tokenAddress: string, network: string): Promise<string> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.deposit({
      user: client.address,
      token: {
        type: ERC20TokenType.ERC20,
           data: {
               decimals: decimals,
               symbol: symbol,
               tokenAddress: tokenAddress
        }
      },
      quantity: ethers.BigNumber.from('1')
    })
  }

async function main(ownerPrivateKey: string, decimals: number, symbol:string, tokenAddress:string, network:string) {
    const response = await depositERC20(ownerPrivateKey, decimals, symbol, tokenAddress, network);
    console.log(`NFT deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <wallet_private_key> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    s: { describe: 'symbol', type: 'string', demandOption: true },
    t: { describe: 'token address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.d, argv.s, argv.t, argv.network)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });