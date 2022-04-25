import { compileContract } from "../L1/compile-contract";
import { deployContract } from "../L1/deploy-contract";
import { createProject } from "../post/create-project";
import { createCollection } from "../post/create-collection";
import { mintV2 } from "../post/mintV2";
import yargs from 'yargs';


async function main(ownerPrivateKey:string, network:string) {
    //Compile the contract
    //await compileContract();

    //Deploy the contract with the below parameters
    console.log('test');
    const deployedContract = await deployContract(ownerPrivateKey, 'Asset', 'Contract Name', 'SYMBOL', network);
    console.log('Deployed contract address:', deployedContract.address)
/*
    //Create a new project
    const project = await createProject(ownerPrivateKey, 'test project', 'test company', 'dane@immutable.com', network)
    console.log('Project id:', project.id)

    //Create collection with the deployed contract and project id
    const collection = await createCollection(ownerPrivateKey, deployedContract.address, 'test collection', project.id, network);
    console.log('Collection address:', collection.address)

    //Mint an asset
    const response = await mintV2(ownerPrivateKey, '1', collection.address, 'test blueprint', await deployedContract.signer.getAddress(), network)
    console.log(response.results)
    */
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    c: { describe: 'contract to deploy, must have artifact in /artifacts', type: 'string', demandOption: true },
    n: { describe: 'name of the contract', type: 'string', demandOption: true },
    y: { describe: 'symbol', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.network)
  .then(() => console.log('Success'))
  .catch(err => {
    console.error(err+'something');
    process.exit(1);
  });
