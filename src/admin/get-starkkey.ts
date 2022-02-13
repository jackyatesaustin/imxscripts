#!/usr/bin/env node

import yargs from 'yargs';
import axios from 'axios';

interface UserResponse {
  accounts: string[]
}

/**
 * Returns a user public stark key given their wallet address.
 * @param walletAddress 
 * @returns 
 */
async function api(walletAddress: string): Promise<UserResponse> {
  const url = `https://api.ropsten.x.immutable.com/v1/users/${walletAddress}`;
  const { data } = await axios.request({ url });
  return data;
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

async function main(walletAddress: string) {
  const response = await api(walletAddress);
  for (const starkKey of response.accounts) {
    console.log(starkKey);
  }
};

main(argv.a)
  .then(() => console.log('Stark key retrieve complete.'))
  .catch(err => console.error(err));
