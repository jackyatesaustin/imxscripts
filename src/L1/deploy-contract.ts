import hre from 'hardhat';
import ethers from "@nomiclabs/hardhat-ethers";
import { getSigner } from '../utils/client';
import { Contract } from "ethers";
import yargs from 'yargs';


export async function deployContract(ownerPrivateKey: string, contract:string, name:string, symbol:string, network:string): Promise<Contract> {
    const signer = await getSigner(network, ownerPrivateKey); 

    // Create the contract factory for the asset defined in the contract parameter
    const contractFactory = await  hre.ethers.getContractFactory(contract, signer);

    // Deploy said contract to the specified network using HardHat, defines the owner as the address for the private key, could be defined as someone else
    return await contractFactory.deploy(signer.address, name, symbol, (network == "mainnet") ? process.env.MAINNET_STARK_CONTRACT_ADDRESS : process.env.ROPSTEN_STARK_CONTRACT_ADDRESS);
}


async function main(ownerPrivateKey: string, contract:string, name:string, symbol:string, network:string): Promise<void> {
    const deployedContract = await deployContract(ownerPrivateKey, contract, name, symbol, network);
    console.log('Deployed contract address:', deployedContract.address)
    console.log('Deployer account:', await deployedContract.signer.getAddress())
}


const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -c <CONTRACT> -n <NAME> -y <SYMBOL> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    c: { describe: 'contract to deploy, must have artifact in /artifacts', type: 'string', demandOption: true },
    n: { describe: 'name of the contract', type: 'string', demandOption: true },
    y: { describe: 'symbol', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.c, argv.n, argv.y, argv.network)
  .then(() => console.log('Contract deployment complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });