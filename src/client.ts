import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-sdk';
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
      const provider = new ethers.providers.JsonRpcProvider(process.env.ROPSTEN_ETH_PROVIDER_URL);
      const signer = privateKey ? new Wallet(privateKey).connect(provider) : undefined
      return await ImmutableXClient.build({ 
        publicApiUrl: process.env.ROPSTEN_ENV_URL!,
        signer,
        // IMX's Ropsten STARK contract address
        starkContractAddress: process.env.ROPSTEN_STARK_CONTRACT_ADDRESS,
        // IMX's Ropsten Registration contract address
        registrationContractAddress: process.env.ROPSTEN_REGISTRATION_CONTRACT_ADDRESS,
  })
}