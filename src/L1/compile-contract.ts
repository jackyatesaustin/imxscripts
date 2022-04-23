import hre from 'hardhat';

//Compiles the all the contracts in src/L1/contracts, contracts path is defined in hardhat.config.ts
async function main() {
    await hre.run('compile');
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});