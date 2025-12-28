import { ethers } from "hardhat";

async function main() {
  // TODO: Replace with your deployed contract address
  const contractAddress = "0x98DDb1C402f04708a8C32162D9B0E3FEcc5548bA";


  console.log(`Attaching to contract at: ${contractAddress}`);
  const farcasterFamilyTree = await ethers.getContractAt("FarcasterFamilyTree", contractAddress);

  const currentMintFee = await farcasterFamilyTree.mintFee();
  console.log(`Current mint fee: ${ethers.formatEther(currentMintFee)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
