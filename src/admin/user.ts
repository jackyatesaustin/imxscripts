#!/usr/bin/env node

import yargs from 'yargs';
import { getClient } from '../client';

interface UserResponse {
  accounts: string[]
}

/**
 * Given a wallet address checks to see if that address is registered
 * on the Ropsten environment.
 * @param walletAddress 
 */
async function checkUser(walletAddress: string): Promise<void> {
  const client = await getClient();
  const isRegistered = await client.isRegistered({ user: walletAddress });
  if (isRegistered) {
    console.log(`${walletAddress} is registered`);
  } else {
    console.log(`${walletAddress} is not registered`);
  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

checkUser(argv.a)
  .catch(err => {
    console.error(err);
  });