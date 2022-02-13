#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-link-lib';

/**
 * Returns the ImmutableXClient which points to the UAT environment.
 * @returns Promise<ImmutableXClient>
 */
 async function getClient(): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({ publicApiUrl: getApiAddress() });
}

/**
 * Returns IMX UAT api base url.
 */
function getApiAddress(): string {
  return 'https://api.ropsten.x.immutable.com/v1';
}

/**
 * This function shows the ETH balance of a given wallet.
 */
 async function showWalletBalance(wallet: Wallet): Promise<void> {
 const balance = await wallet.getBalance();
 const ethAmount = ethers.utils.formatEther(balance);
 console.log(`Account ${wallet.address} available balance: ${ethAmount} eth`);
}

/**
 * Return the current Layer 2 ETH balance for a user.
 */
async function getUserBalance(address: string): Promise<void> {
  const client = await getClient();
  const response = await client.getBalance({ user: address, tokenAddress: 'eth' });
  console.log(`User IMX balance: ${response.balance}`);
}

/**
 * List all the Layer 2 balances across the various token holdings for a user such
 * as ETH, IMX etc.
 */
 async function listUserBalances(address: string): Promise<void> {
  const client = await getClient();
  const response = await client.listBalances({ user: address });
  for (const bal of response.result) {
    console.log(`Token: ${bal.symbol}`);
    console.log(`Balance: ${bal.balance}`);
    console.log(`Withdrawal being prepared: ${bal.preparing_withdrawal}`);
    console.log(`Waithdrawal ready: ${bal.withdrawable}`);
    console.log('');
  }
}

async function main(walletAddress: string): Promise<void> {
  console.log('Response from the getBalance endpoint.')
  await getUserBalance(walletAddress);
  console.log('---------------------------------------')
  console.log('Response from the listBalances endpoint.')
  await listUserBalances(walletAddress);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

main(argv.a)
  .then(() => console.log('Balance retrieve complete.'))
  .catch(err => console.error(err));
