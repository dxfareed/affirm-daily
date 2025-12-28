import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const tokenAddress = "0xf73978b3a7d1d4974abae11f696c1b4408c027a0"//process.env.TOKEN_ADDRESS;
  const signerAddress = "0x66b4978c87C6f32eE25BDe9c49b254A242a4bD8b"//process.env.SIGNER_ADDRESS;
  const dailyAmount = "250"//process.env.DAILY_AMOUNT;

  if (!tokenAddress || !signerAddress || !dailyAmount) {
    console.error("Please set TOKEN_ADDRESS, SIGNER_ADDRESS, and DAILY_AMOUNT in your .env file");
    process.exit(1);
  }

  const DailyGiftXmas = await ethers.getContractFactory("DailyGiftXmas");
  const dailyGiftXmas = await DailyGiftXmas.deploy(
    tokenAddress,
    signerAddress,
    ethers.parseEther(dailyAmount)
  );

  await dailyGiftXmas.waitForDeployment();

  const deployedAddress = await dailyGiftXmas.getAddress();

  console.log("DailyGiftXmas_Deployed_To:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
