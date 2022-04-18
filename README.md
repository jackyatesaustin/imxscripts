# Immutable Integration Scripts

This repository is a collection of CLI scripts to execute common functions on the IMX platform.

## Prerequisites

The scripts in this repository are written in Typescript, and require a Node JS runtime. To get started run
the following commands in your terminal in Mac OS.

1. Install Homebrew - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
2. Install Node - brew install node

## Getting Started

With the pre-requisite software installed, execute the command `npm install` to install the required libraries to
run the code in this repository. Also make sure to rename the .env.example file to .env and populate the different variables.

## Scripts

The scripts can be found in the `src/get` or `src/post` folder, and are broken down below. The network is defined as either `ropsten` or `mainnet` for all scripts.

### GET Requests

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

### POST Requests

#### Burn ERC20

```
npx ts-node ./src/post/burn-ERC20.ts \
  -k <PRVIATE_KEY> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SMART_CONTRACT_ADDRESS> \
  -s <SMART_CONTRACT_ADDRESS> \
  --network <NETWORK>
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

#### Create Buy Order

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
  -k <private_key> \
  -t <token_id> \
  -s <smart_contract_address> \
  --network <NETWORK>                   
```

#### Deposit ERC20

To deposit ERC20 from L1 to L2 issue the following command:

```
npx ts-node ./src/post/deposit-ETH.ts -k <PRIVATE_KEY> -a <AMOUNT> --network <NETWORK>                    
```

#### Mint NFT without royalties

```
npx ts-node ./src/post/mintV2.ts -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -b <BLUEPRINT> -r <RECEIVER_ADDRESS> --network <NETWORK>
```

#### Register user

A user has to be registered in order to do anything on IMX. Registering a user creates a vault in the state of the L2.
```
npx ts-node ./src/post/register-user.ts -k <PRIVATE_KEY> --network <NETWORK>                    
```

#### Transfer ETH

```
npx ts-node ./src/post/transfer-ETH.ts \
  -k <SENDER_PRIVATE_KEY> \
  -t <RECEIVER_ADDRESS> \
  -a <AMOUNT> \
  --network <NETWORK>
```
#### Transfer NFT

```
npx ts-node ./src/post/transfer-NFT.ts \
  -k <SENDER_PRIVATE_KEY> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \
  --network <NETWORK>
```
#### Transfer ERC20

```
npx ts-node ./src/post/transfer-ERC20.ts \
  -k <SENDER_PRIVATE_KEY> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \
  --network <NETWORK>
```

#### Withdrawals

Withdrawals on IMX is a two step process. The withdrawal needs to be prepared first. During preparation funds are deducted from the off-chain vault, and moved into the pending on-chain withdrawals area. This area is accessible to the StarkEx contract which completes the withdrawal when the `completeWithdraw` function is invoked. The `completeWithdraw` function invokes the relevant StarkEx contract function depending on the type of token. For example if we are withdrawing ETH/ERC-20, it invokes the `prepareWithdraw` function. If we are withdrawing a token minted on IMX, it invokes the `withdrawAndMint` else it just invokes the `withdrawNFT` function.

##### Prepare ETH Withdrawal

To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ETH.ts \
  -k <WALLET_PRIVATE_KEY> \
  -a <AMOUNT> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete ETH Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ETH.ts \
  -k <WALLET_PRIVATE_KEY> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network <NETWORK>
```


#### Prepare NFT Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-NFT.ts \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete NFT Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-NFT.ts \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network <NETWORK>
```

#### Prepare ERC20 Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ERC20.ts \
  -k <WALLET_PRIVATE_KEY> \
  -a <AMOUNT> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -t <TOKEN_ADDRESS> \
  --step prepare \ 
  --network <NETWORK>
```

#### Complete ERC20 Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/post/withdraw-ERC20.ts \
  -k <WALLET_PRIVATE_KEY> \
  -d <DECIMALS> \
  -y <SYMBOL> \
  -t <TOKEN_ADDRESS> \
  --step complete \ 
  --network <NETWORK>
```


## TODO:
* Make amount on complete ETH withdrawal optional as it's not a variable
* Add get trades method
* Add get transfers method