#!/usr/bin/env node

import yargs from 'yargs';
import { ethers } from 'ethers';
import { ERC20TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Transfer a token from one user to another.
 */
async function burnERC20(ownerPrivateKey: string, amount: string, decimals: number, symbol: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableBurnResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.burn({
      sender: client.address,
        token: {
          type: ERC20TokenType.ERC20,
            data: {
                decimals: decimals,
                symbol: symbol,
                tokenAddress: tokenAddress
          }
        },
        quantity: ethers.BigNumber.from(amount),
    });
}

async function main(ownerPrivateKey: string, amount: string, decimals: number, symbol:string, tokenAddress:string, network:string): Promise<void> {
    // Burn the ERC20
    const result = await burnERC20(ownerPrivateKey, amount, decimals, symbol, tokenAddress, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE-KEY> -a <AMOUNT> -d <DECIMALS> -s <SYMBOL> -t <TOKEN_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    s: { describe: 'symbol', type: 'string', demandOption: true },
    t: { describe: 'token address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.d, argv.s, argv.t, argv.network)
  .then(() => console.log('Burn Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
