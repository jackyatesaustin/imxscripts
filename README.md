# The goal of this guide is to start using Immutable to mint NFTs and leverage our APIs. Through this guide you will (1) Onboard to Immutable (2) Create NFTs and (3) Manage NFTs

## Onboarding will create your profile. This includes registering a user, creating a project and creating a collection. 

## Note that Projects are an overarching construct and Collections are individual collections of NFTs - you can have a 1:N mapping of Project:Collection(s). 

## Note that this guide creates a single Project and Collection, but you are free to create.


## Prerequisites

The scripts in this repository are written in Typescript, and require a Node JS runtime. To get started run
the following commands in your terminal in Mac OS.

1. Install Homebrew - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
2. Install Node - `brew install node`


## (Onboarding) Step 1: Register a User
1. Change your directory to imx-quickstart
2. run `npm install` and change version of node to v14-v16 if required
3. Run `npm run 1-user-registration`
4. Optionally view this script in ../imx-quickstart/scripts/1-user-registration.ts

Registration sets up an account using the private key from your MetaMask wallet, enabling you to use our authentication system, which protects your project's administrative-level assets from being accessed or updated by someone else. 

## (Onboarding) Step 2: Create a Project
1. Run `npm run 2-create-project`
2. Optionally view this script in ../imx-quickstart/scripts/2-create-project.ts
3. Save the Project ID (e.g., [IMX-CREATE-PROJECT] Created project with ID: 37845)

A project is an administrative level entity that is associated with an owner address. Only the project owner will be authorized to perform administrative tasks (e.g., creating and updating collections).


## (Create NFTs) Step 3: Deploy Immutable's premade Solidity smart contract to Ethereum mainnet.
1. Rename the example.env file to .env
2. In the .env file, make the following edits:
```
ROPSTEN_MINT_RECIEVER_WALLET=<your-ropsten-wallet-address> <--this variable exists at the end of the file and needs to be edited
MAINNET_MINT_RECIEVER_WALLET=<your-mainnet-wallet-address> <--this variable exists at the end of the file and needs to be edited

IMX_ROPSTEN_MINTER_ADDRESS=<your-ropsten-wallet-address>
IMX_ROPSTEN_MINTER_PUBLIC_KEY=<your-ropsten-wallet-public-key> <-- get this via this script: [get script from Dane]
IMX_ROPSTEN_MINTER_PRIVATE_KEY=<your-ropsten-wallet-private-key>
IMX_MAINNET_MINTER_ADDRESS=<your-mainnet-wallet-address>
IMX_MAINNET_MINTER_PUBLIC_KEY=<your-mainnet-wallet-public-key> <-- get this via this script: [get script from Dane]
IMX_MAINNET_MINTER_PRIVATE_KEY=<your-mainnet-wallet-private-key>

PINATA_API_KEY=<your-pinata-api-key> <--this is for IPFS
PINATA_SECRET_KEY=<your-pinata-secret-key>
IMX_ALCHEMY_API_KEY=<your-alchemy-api-key>
IMX_ETHERSCAN_API_KEY=<your-etherscan-api-key>

IMX_CONTRACT_NAME="<your-preferred-L1-smart-contract-name>"
IMX_CONTRACT_SYMBOL="<your-preferred-SYMBOL>"
IMX_COMPANY_NAME="<yuor-company-name>"
IMX_CONTACT_EMAIL="<your-email>"
```
3. run `npx hardhat compile`
4. npm `npm run 0-deploy-solidity-contract`
5. Save your Deployed Contract Address: 'contract-address' (e.g., Deployed Contract Address: 0xc11bf57D37d88565E894eFC6e3f5292E50c32b5B)

Immutable has a premade smart contract. See ../imx-quickstart/contracts/Asset.sol and ../imx-quickstart/contracts/IMintable.sol. See https://github.com/immutable/imx-contracts. This L1 smart contract secures assets on Ethereum mainnet - so they can be secured, deposited and withdrawn independently of Immutable.

You can view the Deployed Contract Address in the Ropsten Etherscan logs. Notice Asset.sol in the contract tab

## (Create NFTs) Step 4: Create a Metadata API
1. Run `npm run 3-create-metadata-api`
2. Optionally view this script in ../imx-quickstart/scripts/3-create-metadata-api.ts
3. Save the IPFS link (e.g., The IPFS gateway URL for your content is 'https://gateway.pinata.cloud/ipfs/QmQoiMLbJD7z4GiH2VogTcGKAG67nnucUixK9rG94WyhTU' (not including the quotes))

The Metadata API is an off-chain storage location for off-chain NFT metadata. In this example, we use IPFS, a distributed file system, to host our metadata. For example, the "name" of our NFT with Token ID "1" is "Anderssen's Opening" - view this in the filename "1" in generated IPFS link.

For each NFT that you will create there is a corresponding TokenID. This TokenID will be used as a 

## (Create NFTs) Step 5: Create a Collection
1. Change your directory to imxscripts (cd ..)
2. Rename the example.env file to .env
3. In the .env file, make the following edits:
```
ROPSTEN_ETH_PROVIDER_URL=<your-alchemy-api-key>
```
4. Run `npm install` and change version of node to v14-v16 if required
5. Run the following:
```
npx ts-node ./src/post/create-collection.ts \
  -k <PRIVATE_KEY> \
  -n <NAME> \
  -s <SMART_CONTRACT_ADDRESS> \
  -p <PROJECT_ID> \
  --network <NETWORK>
```

This Collection is mapped to the deployed smart contract. As aforementioned, you can create multiple Collections that are tied to one Project. To create additional collections, you need to repeat Step 3 and further steps.

View the output and view the address in https://docs.x.immutable.com/reference/getcollection


## (Create NFTs) Step 6: Update collection
1. Run the following:
```
npx ts-node ./src/post/update-collection.ts \
  -k <PRIVATE_KEY> \
  -s <SMART_CONTRACT_ADDRESS> \
  -n <NAME> \
  -d <DESCRIPTION> \
  -i <ICON_URL> \
  -m <METADATA_API_URL> \
  -o <COLLECTION_IMAGE_URL> \
  --network ropsten
```
Adding the Metadata API to the Collection associates metadata at a given URL to tokens upon mint. When you mint, you execute an API call that requires a TokenID and smart contract address parameter. The mint will find the Collection given the Smart Contract Address and mint the given TokenID. The given TokenID needs to map to a URI (eg https://gateway.pinata.cloud/ipfs/QmQoiMLbJD7z4GiH2VogTcGKAG67nnucUixK9rG94WyhTU/7 where TokenID is 7).


## (Create NFTs) Step 7: Add Metadata Schema to Collection
1. Edit the file ../src/post/add-metadata-schema.ts by adding in your metadata. When the boolean 'filterable' is true, you will be able to filter on that metadata in the IMX marketplace.
2. Run the following:

```
npx ts-node ./src/post/add-metadata-schema.ts \
  -k <PRIVATE_KEY> \
  -s <SMART_CONTRACT_ADDRESS> \
  --network <NETWORK>
```
## (Create NFTs) Step 8: Mint NFTs
1. Run the following to mint NFTs in bulk:
 ```
npx ts-node ./src/post/bulk-mintV2.ts \
  -k <PRIVATE_KEY> \
  -t <STARTING_TOKEN_ID> \
  -n <COUNT_OF_TOKENS_TO_MINT> \
  -s <SMART_CONTRACT_ADDRESS> \
  -b <BLUEPRINT> \
  -r <RECEIVER_ADDRESS> \
  --network <NETWORK>
```

For example, the below script will start with Token ID 1, and mint tokens 1, 2, 3, .. 8, 9 and 10.
```
npx ts-node ./src/post/bulk-mintV2.ts \
  -k <your-wallets-private-key> \
  -t 1 \         
  -n 10 \          
  -s <your-smart-contract-address> \
  -b on-chain-text \
  -r <your-wallet-address> \
  --network ropsten 
```


## (Manage NFTs) Step 9: GET/POST Scripts to manage NFTs
The scripts can be found in the `src/get` or `src/post` folder, and are broken down below. The network is defined as either `ropsten` or `mainnet` for all scripts.


#### Retrieve a users ETH balance

```
npx ts-node ./src/get/get-balance.ts -a <WALLET_ADDRESS> --network <NETWORK>
```

#### Retrieve a users inventory

```
npx ts-node ./src/get/get-user-assets.ts -a <WALLET_ADDRESS> --network <NETWORK>
```

#### Check whether a wallet is registered on IMX

```
npx ts-node ./src/get/get-user.ts -a <WALLET_ADDRESS> --network <NETWORK>
```


#### Burn NFT

```
npx ts-node ./src/post/burn-NFT.ts \
  -k <PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --network <NETWORK>
```

#### Create NFT<>ETH Sell Order

```
npx ts-node ./src/post/create-NFT-ETH-sell-order.ts \
  -k <PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  -a <SALE_AMOUNT> \
  --network <NETWORK>
```

#### Create buy order

```
npx ts-node ./src/post/create-buy-order.ts \
  -k <PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  -a <SALE_AMOUNT> \
  -o <ORDER_ID> \
  --network <NETWORK>
```

#### Deposit ETH

To deposit ETH from L1 to L2 issue the following command:

```
npx ts-node ./src/post/deposit-ETH.ts -k <PRIVATE_KEY> -a <AMOUNT> --network <NETWORK>                    
```

#### Deposit NFT

To deposit an NFT from L1 to L2 issue the following command:

```
npx ts-node ./src/post/deposit-NFT.ts \
  -k <PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --network <NETWORK>                   
```

#### Deposit ERC20

To deposit ERC20 from L1 to L2 issue the following command:

```
npx ts-node ./src/post/deposit-ETH.ts -k <PRIVATE_KEY> -a <AMOUNT> --network <NETWORK>                    
```


#### Transfer ETH

```
npx ts-node ./src/post/transfer-ETH.ts \
  -k <PRIVATE_KEY>> \
  -t <RECEIVER_ADDRESS> \
  -a <AMOUNT> \
  --network <NETWORK>
```
#### Transfer NFT

```
npx ts-node ./src/post/transfer-NFT.ts \
  -k <PRIVATE_KEY>> \
  -r <RECEIVER-ADDRESS> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --network <NETWORK>
```
#### Transfer ERC20

```
npx ts-node ./src/post/transfer-ERC20.ts \
  -k <PRIVATE_KEY>> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \
  --network <NETWORK>
```

#### Withdrawals

Withdrawals on IMX is a two step process. The withdrawal needs to be prepared first. During preparation funds are deducted from the off-chain vault, and moved into the pending on-chain withdrawals area. This area is accessible to the StarkEx contract which completes the withdrawal when the `completeWithdraw` function is invoked. The `completeWithdraw` function invokes the relevant StarkEx contract function depending on the type of token. For example if we are withdrawing ETH/ERC-20, it invokes the `prepareWithdraw` function. If we are withdrawing a token minted on IMX, it invokes the `withdrawAndMint` else it just invokes the `withdrawNFT` function.

##### Prepare ETH withdrawal

To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ETH.ts \
  -k <PRIVATE_KEY>> \
  -a <AMOUNT> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete ETH withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ETH.ts \
  -k <PRIVATE_KEY>> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network <NETWORK>
```


#### Prepare NFT withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-NFT.ts \
  -k <PRIVATE_KEY>> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete NFT withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-NFT.ts \
  -k <PRIVATE_KEY>> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network <NETWORK>
```

#### Prepare ERC20 withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ERC20.ts \
  -k <PRIVATE_KEY>> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -t <TOKEN_ADDRESS> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete ERC20 withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ERC20.ts \
  -k <PRIVATE_KEY>> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -t <TOKEN_ADDRESS> \
  --step complete \ 
  --network <NETWORK>
```
