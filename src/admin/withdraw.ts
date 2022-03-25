#!/usr/bin/env node

import yargs from 'yargs';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../client';

async function prepareWithdraw(privateKey: string, tokenId: string, smartContractAddress: string): Promise<void> {
  const client = await getClient(privateKey);
  await client.prepareWithdrawal({
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

async function completeWithdraw(privateKey: string, tokenId: string, smartContractAddress: string): Promise<string> {
  const client = await getClient(privateKey);
  return await client.completeWithdrawal({
    starkPublicKey: client.starkPublicKey,
    token: {
      type: ERC721TokenType.ERC721,
      data: {
        tokenId,
        tokenAddress: smartContractAddress
      }
    }
  })
}

/**
 * Invokes either withdraw or prepareWithdraw depending on the values of the arguments
 * walletAddress and starkPublicKey.
 */
async function main(
    privateKey: string,
    tokenId: string,
    smartContractAddress: string,
    step: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareWithdraw(privateKey, tokenId, smartContractAddress);
    console.log(result);
  }  else {
    const result = await completeWithdraw(privateKey, tokenId, smartContractAddress);
    console.log(result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <private_key> -t <token_id> -s <smart_contract_address> -step <current_withdrawal_step>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true},
    t: { describe: 'token id', type: 'string', demandOption: true},
    s: { describe: 'smart contract address', type: 'string', demandOption: true},
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.step)
  .then(() => console.log('Withdrawal complete.'))
  .catch(err => console.error(err));

