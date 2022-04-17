#!/usr/bin/env node

import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ERC721TokenType, ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';


async function sellNFT(ownerPrivateKey: string, tokenAddress: string, tokenId: string, sale_amount: string, network: string): Promise<ImmutableMethodResults.ImmutableCreateOrderResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.createOrder ({
        user: client.address,
        tokenSell: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: tokenAddress,
                tokenId: tokenId
            },
        },
        amountSell: ethers.BigNumber.from('1'),
        tokenBuy: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountBuy: ethers.BigNumber.from(sale_amount)
    })
}

async function main(ownerPrivateKey: string, tokenAddress: string, tokenId: string, sale_amount:string, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await sellNFT(ownerPrivateKey, tokenId, tokenAddress, sale_amount, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -a <SALE_AMOUNT> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    a: { describe: 'sale amount', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.a, argv.network)
  .then(() => console.log('NFT Transfer Complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });