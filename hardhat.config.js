require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ROPSTEN_ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.ROPSTEN_DEPLOYER_PRIVATE_KEY}`],
    }
  }
};

