import { ethers } from "hardhat";

// #############################################################################
// ############################ IMPORTANT ######################################
// #############################################################################
//
//      REPLACE THIS WITH THE ACTUAL ADDRESS OF YOUR DEPLOYED CONTRACT
//
// #############################################################################
const CONTRACT_ADDRESS = "0x999f46f34292771f77ed1a5f59ca18ea1ac29ff7";
// #############################################################################


async function main() {
  const [owner] = await ethers.getSigners();
  console.log(`Using owner account: ${owner.address}`);

  console.log(`Connecting to contract at address: ${CONTRACT_ADDRESS}`);
  const religiousWarplet = await ethers.getContractAt("ReligiousWarplet", CONTRACT_ADDRESS, owner);

  console.log("Calling the withdraw function...");

  const tx = await religiousWarplet.withdraw();

  console.log(`Withdrawal transaction sent! Hash: ${tx.hash}`);
  console.log("Waiting for transaction to be confirmed...");

  const receipt = await tx.wait();

  console.log("Withdrawal transaction confirmed!");
  //@ts-ignore
  console.log(`Block Number: ${receipt.blockNumber}`);
  //@ts-ignore
  console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});