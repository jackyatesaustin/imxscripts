#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../client';

/**
 * Transfer a token from one user to another.
 */
async function transfer(client: ImmutableXClient, to: string, amount: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
    return client.transfer({
        sender: client.address,
        token: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18
            }
        },
        quantity: ethers.utils.parseEther(amount),
        receiver: to,
    });
}

/**
 * Send some ethereum ("fund") from one wallet to another on L1.
 * @param sender - Wallet with the source of funds.
 * @param receiver - Destination for the funds.
 * @param amount - The amount fo fund in Ether.
 */
 async function fundAccount(sender: Wallet, receiver: Wallet, amount: string): Promise<void> {
 console.log(`Sending ${amount} eth from `, sender.address, " to ", receiver.address);
 (await sender.sendTransaction({
     to: receiver.address,
     value: ethers.utils.parseEther(amount)
 })
 ).wait();
}

async function main(fromPrivateKey: string, toAddress: string, amount: string): Promise<void> {
    const fromClient = await getClient(fromPrivateKey);

    // Transfer the token to the administrator
    await transfer(fromClient, toAddress, amount);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <from_private_key> -t <to_wallet_address> -a <amount>')
  .options({
    k: { describe: 'sender private key', type: 'string', demandOption: true },
    t: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.k, argv.t, argv.a)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
