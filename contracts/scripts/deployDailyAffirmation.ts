import { ethers, run } from "hardhat";

async function main() {
    console.log("Starting deployment of DailyAffirmation...");

    const rewardToken = "0xf73978b3a7d1d4974abae11f696c1b4408c027a0";
    const signer = "0x66b4978c87C6f32eE25BDe9c49b254A242a4bD8b";

    if (!rewardToken || !signer) {
        throw new Error("Missing env vars: REWARD_TOKEN_ADDRESS or SIGNER_ADDRESS");
    }

    // No fee - free to claim
    const fee = ethers.parseEther("0");

    // Default reward: 50 tokens (assuming 18 decimals), unless specified
    const rewardAmount = ethers.parseUnits("10", 18);

    console.log("Deploying with params:");
    console.log("Reward Token:", rewardToken);
    console.log("Signer:", signer);
    console.log("Fee:", ethers.formatEther(fee), "ETH");
    console.log("Reward Amount:", ethers.formatUnits(rewardAmount, 18));

    const DailyAffirmation = await ethers.getContractFactory("DailyAffirmation");
    const contract = await DailyAffirmation.deploy(
        rewardToken,
        signer,
        rewardAmount,
        fee
    );

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`DailyAffirmation deployed to: ${address}`);

    console.log("Waiting for block confirmations...");
    // Wait 10 seconds or a few blocks
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: [
                rewardToken,
                signer,
                rewardAmount,
                fee
            ],
        });
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
