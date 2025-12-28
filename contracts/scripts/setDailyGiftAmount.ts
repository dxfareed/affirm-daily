import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xf6a9D4E62bdD78A5795828f36fD607D7A4ab8D9d"; // Replace with your deployed DailyGiftXmas contract address
  const newDailyAmount = "250"; // The new daily amount

  const DailyGiftXmas = await ethers.getContractFactory("DailyGiftXmas");
  const dailyGiftXmas = DailyGiftXmas.attach(contractAddress);

  console.log(`Setting daily amount to ${newDailyAmount} for DailyGiftXmas at ${contractAddress}...`);

  const tx = await dailyGiftXmas.setDailyAmount(ethers.parseEther(newDailyAmount));
  await tx.wait();

  console.log(`Daily amount updated to ${newDailyAmount}. Transaction hash: ${tx.hash}`);
  
  const updatedAmount = await dailyGiftXmas.dailyAmount();
  console.log(`Verified new daily amount: ${ethers.formatEther(updatedAmount)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
