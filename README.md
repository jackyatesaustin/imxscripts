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

The scripts can be found in the `src/get` or `src/post` folder, and are broken down below.

### GET Requests

#### Retrieve a users ETH balance

```
npx ts-node ./src/admin/get-balance.ts -a <WALLET_ADDRESS> --network ropsten
```

#### Retrieve a users inventory

```
npx ts-node ./src/admin/get-user-assets.ts -a <WALLET_ADDRESS> --network ropsten
```

#### Retrieve a Starkkey associated to a user

```
npx ts-node ./src/admin/get-starkkey.ts -a <WALLET_ADDRESS> --network ropsten
```

#### Check whether a wallet is registered on IMX

```
npx ts-node ./src/admin/user.ts -a <WALLET_ADDRESS> --network ropsten
```

### POST Requests

#### Transfers

Transfer a token between two users on IMX. This command only supports the transfer of ETH between
users.

#### ETH Transfer

```
npx ts-node ./src/post/transfer-ETH.ts -k <SENDER_PRIVATE_KEY> -t <RECEIVER_ADDRESS> -a <AMOUNT> --network ropsten
```
#### NFT Transfer

```
npx ts-node ./src/post/transfer-NFT.ts -k <SENDER_PRIVATE_KEY> -a <AMOUNT> -d <DECIMALS> -s <SYMBOL> -t <TOKEN_ADDRESS> --step prepare --network ropsten
```
#### ERC20 Transfer

```
npx ts-node ./src/post/transfer-ERC20.ts -k <SENDER_PRIVATE_KEY> -a <AMOUNT> -d <DECIMALS> -s <SYMBOL> -t <TOKEN_ADDRESS> --step prepare --network ropsten
```

#### Deposits

The current implementation only supports the depositing of ETH from L1 to L2.
This script updates a users IMX balance. To deposit ETH from L1 to L2 issue the following command;

```
npx ts-node ./src/admin/deposit.ts -k <WALLET_PRIVATE_KEY> -a <AMOUNT_IN_ETH> --network ropsten
```

#### Withdrawals

Withdrawals on IMX is a two step process. The withdrawal needs to be prepared first. During preparation funds are deducted from the off-chain vault, and moved into the pending on-chain withdrawals area. This area is accessible to the StarkEx contract which completes the withdrawal when the `completeWithdraw` function is invoked. The `completeWithdraw` function invokes the relevant StarkEx contract function depending on the type of token. For example if we are withdrawing ETH/ERC-20, it invokes the `prepareWithdraw` function. If we are withdrawing a token minted on IMX, it invokes the `withdrawAndMint` else it just invokes the `withdrawNFT` function.

#### Prepare ETH Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-ETH.ts \
  -k <WALLET_PRIVATE_KEY> \
  -a <AMOUNT> \
  --step prepare \ 
  --network ropsten
```

#### Complete ETH Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-ETH.ts \
  -k <WALLET_PRIVATE_KEY> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network ropsten
```


#### Prepare NFT Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-NFT.ts \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS> \
  --step prepare \ 
  --network ropsten
```

#### Complete NFT Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-NFT.ts \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network ropsten
```

#### Prepare ERC20 Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To prepare a withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-ERC20.ts \
  -k <WALLET_PRIVATE_KEY> \
  -a <AMOUNT> \
  --step prepare \ 
  --network ropsten
```

#### Complete ERC20 Withdrawal

The current implementation only supports the withdrawal preparation of an ERC-721 token.
To complete the withdrawal issue the following command;

```
npx ts-node ./src/admin/withdraw-ERC20.ts \
  -k <WALLET_PRIVATE_KEY> \
  -t <TOKEN_ID> \
  -s <SMART_CONTRACT_ADDRESS>
  --step complete \ 
  --network ropsten
```


## TODO:

* Add burn
* Make amount on complete ETH withdrawal optional as it's not a variable