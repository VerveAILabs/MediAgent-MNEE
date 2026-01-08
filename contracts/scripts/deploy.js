const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const MediClaim = await hre.ethers.getContractFactory("MediClaimMNEE");
    const mediClaim = await MediClaim.deploy();

    await mediClaim.waitForDeployment();

    console.log("MediClaimMNEE deployed to:", await mediClaim.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
