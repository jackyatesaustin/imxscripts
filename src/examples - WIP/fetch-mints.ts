#!/usr/bin/env node

import yargs from 'yargs';
import axios from 'axios';

interface MintResponse {
  transaction_id: number,
  status: string,
  user: string,
  token: { type: string, data: [Object] },
  timestamp: string
}

/**
 * Return the details of a specific token mint on IMX.
 * 
 * @param mintID - unique mint identifier.
 * @returns 
 */
async function api(mintID: number): Promise<MintResponse[]> {
  const url = `https://api.ropsten.x.immutable.com/v1/mints/${mintID}`;
  const { data } = await axios.request({ url });
  return data;
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -m <mint_id>')
  .options({ m: { alias: 'mintid', describe: '', type: 'number', demandOption: true }})
  .parseSync();

async function main(mintId: number) {
  const response = await api(mintId);
  for (const mint of response) {
    console.log(mint);
  }
};

main(argv.m)
  .then(() => console.log('Mint retrieve complete.'))
  .catch(err => console.error(err));