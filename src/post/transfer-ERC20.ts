#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ERC20TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Transfer a token from one user to another.
 */
async function transferERC20(ownerPrivateKey: string, receiver: string, amount: string, decimals: number, symbol: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.transfer({
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
        receiver: receiver,
    });
}

async function main(ownerPrivateKey: string, receiver: string, amount: string, decimals: number, symbol:string, tokenAddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await transferERC20(ownerPrivateKey, receiver, amount, decimals, symbol, tokenAddress, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <from_private_key> -t <to_wallet_address> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'ERC20 amount', type: 'string', demandOption: true },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    s: { describe: 'symbol', type: 'string', demandOption: true },
    t: { describe: 'token address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.r, argv.a, argv.d, argv.s, argv.t, argv.network)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
