import hre from 'hardhat';

//Compiles the all the contracts in src/L1/contracts, contracts path is defined in hardhat.config.ts
export async function compileContract() {
    await hre.run('compile');
}

async function main() {
    await compileContract();
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});