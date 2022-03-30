#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ERC721TokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Transfer a token from one user to another.
 */
async function transferNFT(ownerPrivateKey: string, receiver: string, tokenId: string, tokenAddress: string, network: string): Promise<ImmutableMethodResults.ImmutableTransferResult> {
  const client = await getClient(network, ownerPrivateKey);  
  return client.transfer({
      sender: client.address,
        token: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenId: tokenId,
                tokenAddress: tokenAddress
            }
        },
    quantity: ethers.BigNumber.from(1),
    receiver: receiver,
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

async function main(ownerPrivateKey: string, receiver: string, tokenid: string, tokenaddress:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    await transferNFT(ownerPrivateKey, receiver, tokenid, tokenaddress, network);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <from_private_key> -t <to_wallet_address> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.r, argv.t, argv.s, argv.network)
  .then(() => console.log('NFT Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
