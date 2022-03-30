#!/usr/bin/env node

import yargs from 'yargs';
import { ERC20TokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../utils/client';

async function prepareERC20Withdraw(ownerPrivateKey: string, amount: string,  decimals: number, symbol: string, tokenAddress: string, network: string): Promise<void> {
    const client = await getClient(network, ownerPrivateKey);
    const quantity = ethers.utils.parseEther(amount);
    await client.prepareWithdrawal({
        user: client.address,
        token: {
          type: ERC20TokenType.ERC20,
             data: {
                 decimals: decimals,
                 symbol: symbol,
                 tokenAddress: tokenAddress
          }
        },
        quantity: ethers.BigNumber.from(amount)
      })
    }

async function completeERC20Withdraw(ownerPrivateKey: string,  decimals: number, symbol: string, tokenAddress: string, network: string): Promise<string> {
    const client = await getClient(network, ownerPrivateKey);
    return await client.completeWithdrawal({
        starkPublicKey: client.starkPublicKey,
        token: {
            type: ERC20TokenType.ERC20,
               data: {
                   decimals: decimals,
                   symbol: symbol,
                   tokenAddress: tokenAddress
            }
        },
    })
}

async function main(ownerPrivateKey: string, decimals: number, symbol:string, tokenAddress:string, step: string, network:string, amount?: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareERC20Withdraw(ownerPrivateKey, amount!, decimals, symbol, tokenAddress, network);
    console.log('Preparing withdrawal');
    console.log('Result: ' + result);
  }  else {
    const result = await completeERC20Withdraw(ownerPrivateKey, decimals, symbol, tokenAddress, network);
    console.log('Completing withdrawal');
    console.log('Result: ' + result);
  }
}

const argv = yargs(process.argv.slice(2))
    .usage('Usage: -k <private_key> -d <decimals> -s <symbol> -t <token_address> amount --step <current_withdrawal_step> --network <network to withdraw>')
    .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: false },
    d: { describe: 'decimals', type: 'number', demandOption: true },
    s: { describe: 'symbol', type: 'string', demandOption: true },
    t: { describe: 'token address', type: 'string', demandOption: true },
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
    })
  .parseSync();

  main(argv.k, argv.d, argv.s, argv.t, argv.step, argv.network, argv.a)
  .then(() => console.log('Withdrawal sent without returned errors.'))
  .catch(err => console.error(err));