const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediClaimMNEE", function () {
    it("Should set the right owner", async function () {
        const [owner] = await ethers.getSigners();
        const MediClaim = await ethers.getContractFactory("MediClaimMNEE");
        const mediClaim = await MediClaim.deploy();

        expect(await mediClaim.owner()).to.equal(owner.address);
    });

    it("Should allow owner to pay provider", async function () {
        const [owner, provider] = await ethers.getSigners();
        const MediClaim = await ethers.getContractFactory("MediClaimMNEE");
        const mediClaim = await MediClaim.deploy();

        const amount = ethers.parseEther("1.0");
        const docHash = ethers.id("claim-123");

        // Deposit funds into contract first
        await owner.sendTransaction({
            to: await mediClaim.getAddress(),
            value: amount,
        });

        await expect(mediClaim.payProvider(provider.address, amount, docHash))
            .to.emit(mediClaim, "PaymentSettled")
            .withArgs(provider.address, amount, docHash, (val) => true);
    });
});
