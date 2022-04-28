#!/usr/bin/env node

import yargs from 'yargs';
import { ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

/**
 * Mint a token to the given user.
 */
 async function mintV2(ownerPrivateKey: string, tokenId: string, mintCount: string, tokenAddress: string, bluePrint: string, receiver: string, network: string, royalties?: any[]) 
 : Promise<ImmutableMethodResults.ImmutableOffchainMintV2Results> {
    const client = await getClient(network, ownerPrivateKey);
    //console.log("in v2 function minting this token ID: " + tokenId);
    return await client.mintV2([{
        users: [{
            etherKey: receiver.toLowerCase(),
            tokens: [{
                id: tokenId,
                blueprint: bluePrint,
                royalties: royalties
            }]
        }],
        contractAddress: tokenAddress
    }]);
}


/** 
 * Loop through the mintV2 function call to pass incremented tokenIDs
 */
async function main(ownerPrivateKey: string, tokenId: string, mintCount: string, tokenAddress: string, bluePrint: string, receiver: string, network:string): Promise<void> {
  //str to int
  //var x = "32";
  //var y: number = +x;
  var token_id: number = +tokenId;
  var mint_count: number = +mintCount;
  var last_mint = token_id + mint_count;
  var cur_token_id:number = token_id;

  while (cur_token_id < last_mint) {
    if (cur_token_id > last_mint) {
        console.log("ended mint on tokenId: " + cur_token_id);
        break; //exit the loop
    }
    // Transfer the token to the administrator -- '${cur_token_id}'
    var mint_this: string = cur_token_id + '';
    //console.log("currently minting this tokenID: " + mint_this);
    const result = await mintV2(ownerPrivateKey, mint_this, mintCount, tokenAddress, bluePrint, receiver, network);
    console.log(result)
    cur_token_id++;

  }
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -n <MINT_COUNT> -s <SMART_CONTRACT_ADDRESS> -b <BLUEPRINT> -r <RECEIVER_ADDRESS> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    //Add how many tokens to create
    n: { describe: 'number of tokens', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    b: { describe: 'blueprint', type: 'string', demandOption: true },
    r: { describe: 'receiver address', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.n, argv.s, argv.b, argv.r, argv.network)
  .then(() => console.log('Tokens minted'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });