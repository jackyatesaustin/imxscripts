import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-link-lib';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.s
 * @param privateKey - Ethereum wallet private key
 * @param gasLimit - maximum amount of Gas that a user is willing to pay for performing this action or confirming a transaction (a minimum of 21,000)
 * @param gasPrice - price of Gas (Gas Price) is the amount of Gwei that the user is willing to spend on each unit of Gas
 */
export async function getClient(privateKey?: string)
  : Promise<ImmutableXClient> {
    if(privateKey) {
      const provider = new ethers.providers.JsonRpcProvider(process.env.ROPSTEN_ETH_PROVIDER_URL);
      const signer = privateKey ? new Wallet(privateKey).connect(provider) : undefined
      return await ImmutableXClient.build({ 
        publicApiUrl: 'https://api.ropsten.x.immutable.com/v1',
        signer,
        // IMX's Ropsten STARK contract address
        starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
        // IMX's Ropsten Registration contract address
        registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
  })
    } else {
      return await ImmutableXClient.build({ publicApiUrl: 'https://api.ropsten.x.immutable.com/v1' });
    }
}