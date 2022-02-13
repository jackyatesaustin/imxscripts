#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ImmutableXClient, ImmutableXWallet } from '@imtbl/imx-link-lib';
import { ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-link-types';

/**
 * Transfer a token from one user to another.
 */
async function transfer(client: ImmutableXClient, from: ethers.Wallet, to: string, amount: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
    return client.transfer({
        sender: from.address,
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
 * Return the ImmutableXClient for a given user (i.e. wallet). This user is
 * used to sign the corresponding requests.
 */
async function getClient(w: ethers.Wallet): Promise<ImmutableXClient> {
    const wallet = new ImmutableXWallet(w);
    await wallet.controller.account('starkex', 'immutablex', '1');
    return new ImmutableXClient('https://api.ropsten.x.immutable.com/v1/', wallet, {} as any, {} as any, {} as any, {} as any);
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
    const provider = new ethers.providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/<ALCHEMY_API_KEY>');

    const user1 = new ethers.Wallet(fromPrivateKey).connect(provider);
    const user1Client = await getClient(user1);

    // Transfer the token to the administrator
    await transfer(user1Client, user1, toAddress, amount);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -f <from_private_key> -t <to_wallet_address> -a <amount>')
  .options({
    f: { describe: 'sender private key', type: 'string', demandOption: true },
    t: { describe: 'receiver address', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.f, argv.t, argv.a)
  .then(() => console.log('Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
