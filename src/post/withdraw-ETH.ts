#!/usr/bin/env node

import yargs from 'yargs';
import { ETHTokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../utils/client';

async function prepareETHWithdraw(privateKey: string, amount:string, network:string): Promise<void> {
  const client = await getClient(network, privateKey);
  const quantity = ethers.utils.parseEther(amount);
  await client.prepareWithdrawal({
    user: await client.address,
    token: {
      type: ETHTokenType.ETH,
      data: {
        decimals: 18,
      }
    },
    quantity
  });
}

async function completeETHWithdraw(privateKey: string, amount: string, network: string): Promise<string> {
  const client = await getClient(network, privateKey);
  const quantity = ethers.utils.parseEther(amount);
  return await client.completeWithdrawal({
    starkPublicKey: client.starkPublicKey,
    token: {
        type: ETHTokenType.ETH,
        data: {
          decimals: 18,
        }
      },
    });
  }

/**
 * Invokes either withdraw or prepareWithdraw depending on the values of the arguments
 * walletAddress and starkPublicKey.
 */
async function main(
    privateKey: string,
    amount: string,
    step: string,
    network: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareETHWithdraw(privateKey, amount, network);
    console.log('Preparing withdrawal');
    console.log('Result: ' + result);
  }  else {
    const result = await completeETHWithdraw(privateKey, amount, network);
    console.log('Completing withdrawal');
    console.log('Result: ' + result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -a <AMOUNT> --step <WITHDRAWAL_STEP> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true },
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.step, argv.network)
  .then(() => console.log('Withdrawal sent without returned errors.'))
  .catch(err => console.error(err));

