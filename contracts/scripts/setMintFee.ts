import { ethers } from "hardhat";

async function main() {
  // TODO: Replace with your deployed contract address
  const contractAddress = "0x98DDb1C402f04708a8C32162D9B0E3FEcc5548bA";
  
  // TODO: Replace with the new mint fee you want to set (as a string)
  const newMintFeeString = "0.00004"; 


  const newMintFee = ethers.parseEther(newMintFeeString);

  console.log(`Attaching to contract at: ${contractAddress}`);
  const farcasterFamilyTree = await ethers.getContractAt("FarcasterFamilyTree", contractAddress);

  const oldMintFee = await farcasterFamilyTree.mintFee();
  console.log(`Current mint fee is: ${ethers.formatEther(oldMintFee)} ETH`);

  if (newMintFee === oldMintFee) {
    console.log("New mint fee is the same as the current one. No update needed.");
    return;
  }

  console.log(`Setting new mint fee to: ${newMintFeeString} ETH`);
  
  const tx = await farcasterFamilyTree.setMintFee(newMintFee);
  
  console.log("Transaction sent. Waiting for confirmation...");
  await tx.wait();
  
  console.log("Mint fee update transaction confirmed.");
  console.log(`Transaction hash: ${tx.hash}`);

  const updatedMintFee = await farcasterFamilyTree.mintFee();
  console.log(`Verified new mint fee on-chain: ${ethers.formatEther(updatedMintFee)} ETH`);

  if (updatedMintFee === newMintFee) {
    console.log("Mint fee updated successfully!");
  } else {
    console.error("Error: Mint fee was not updated.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
