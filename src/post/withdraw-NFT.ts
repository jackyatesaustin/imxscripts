#!/usr/bin/env node

import yargs from 'yargs';
import { ERC721TokenType } from '@imtbl/imx-sdk';
import { ethers } from 'ethers';
import { getClient } from '../utils/client';

async function prepareNFTWithdraw(privateKey: string, tokenId: string, smartContractAddress: string, network:string): Promise<void> {
  const client = await getClient(network, privateKey);
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

async function completeNFTWithdraw(privateKey: string, tokenId: string, smartContractAddress: string, network: string): Promise<string> {
  const client = await getClient(network, privateKey);
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
    step: string,
    network: string): Promise<void> {
  if (step === 'prepare') {
    const result = await prepareNFTWithdraw(privateKey, tokenId, smartContractAddress, network);
    console.log('Preparing withdrawal');
    console.log('Result: ' + result);
  }  else {
    const result = await completeNFTWithdraw(privateKey, tokenId, smartContractAddress, network);
    console.log('Completing withdrawal');
    console.log('Result: ' + result);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <private_key> -t <token_id> -s <smart_contract_address> --step <current_withdrawal_step> --network <network to withdraw>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true},
    t: { describe: 'token id', type: 'string', demandOption: true},
    s: { describe: 'smart contract address', type: 'string', demandOption: true},
    step: { describe: 'step in the withdrawal process. prepare or complete', type: 'string', demandOption: true},
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.step, argv.network)
  .then(() => console.log('Withdrawal sent without returned errors.'))
  .catch(err => console.error(err));

