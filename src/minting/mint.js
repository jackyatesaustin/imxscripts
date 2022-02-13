const { AlchemyProvider } = require("@ethersproject/providers");
const { Wallet } = require("@ethersproject/wallet");
const { ImmutableXClient } = require("@imtbl/imx-link-lib");
const {
  MintableERC721TokenType,
  MintableERC20TokenType,
} = require("@imtbl/imx-link-types");

const client = {
  publicApiUrl: "https://api.ropsten.x.immutable.com/v1",
  starkContractAddress: "0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef",
  gasLimit: "5000000",
  gasPrice: "20000000000",
};

const alchemyApiKey = "<change_me>";
const privateKey = "<change_me>";
const userAddress = "<change_me>";
const smartContractAddress = "<change_me>";

// tokenAddress is the smart contract address.
// id is the client generated token. Partner should track this, and the returned token id on a successful mint.
const token = {
  type: MintableERC721TokenType.MINTABLE_ERC721,
  data: {
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER + 1).toString(),
    blueprint: "<on-chain metadata>",
    tokenAddress: smartContractAddress,
  },
};

const provider = new AlchemyProvider("ropsten", alchemyApiKey);

const waitForTransaction = async (txId) => {
  console.log("Waiting for transaction", {
    txId,
    etherscanLink: `https://ropsten.etherscan.io/tx/${txId}`,
    alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-ropsten/tx/${txId}`,
  });
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error("Transaction rejected");
  }
  console.log("Transaction Mined: " + receipt.blockNumber);
  return receipt;
};

(async () => {
  // Minter needs to be the owner of the smart contract.
  const minter = await ImmutableXClient.build({
    ...client,
    signer: new Wallet(privateKey).connect(provider),
  });

  console.log("TOKEN: ", JSON.stringify(token));
  console.log("MINTER REGISTRATION");

  const registerImxResult = await minter.registerImx({
    etherKey: minter.address.toLowerCase(),
    starkPublicKey: minter.starkPublicKey,
  });

  if (registerImxResult.tx_hash === "") {
    console.log("Minter registered, continuing...");
  } else {
    console.log("Waiting for minter registration...");
    await waitForTransaction(registerImxResult.tx_hash);
  }

  console.log("L2 MINT");

  const result = await minter.mint({
    mints: [
      {
        etherKey: userAddress.toLowerCase(),
        tokens: [token],
        nonce: "1",
        authSignature: "", // leave blank as this is automatically populated by the lib
      },
    ],
  });
  console.log(result);
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
