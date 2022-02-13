import { ethers } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-link-lib';

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.
 * @param w - Ethereum wallet used to fund any L1 transactions
 * @param gasLimit - maximum amount of Gas that a user is willing to pay for performing this action or confirming a transaction (a minimum of 21,000)
 * @param gasPrice - price of Gas (Gas Price) is the amount of Gwei that the user is willing to spend on each unit of Gas
 */
export async function getClient(w: ethers.Wallet, gasLimit = '80000', gasPrice = '2000000000')
  : Promise<ImmutableXClient> {

  return await ImmutableXClient.build({
    publicApiUrl: process.env.ROPSTEN_URL || '',
    signer: w,
    starkContractAddress: process.env.ROPSTEN_STARK_CONTRACT_ADDRESS,
    registrationContractAddress: process.env.ROPSTEN_REGISTRATION_CONTRACT_ADDRESS,
    gasLimit: gasLimit,
    gasPrice: gasPrice
  })
}