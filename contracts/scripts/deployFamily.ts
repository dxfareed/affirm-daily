import { ethers, run } from "hardhat";
import { parseEther } from "ethers";

async function main() {
  console.log("Preparing to deploy the ReligiousWarplet contract...");

  const FarcasterFamilyTreeFactory = await ethers.getContractFactory("FarcasterFamilyTree");

  // --- Contract Constructor Arguments ---
  const initialMintFee = parseEther("0.00008");
  const constructorArgs = [initialMintFee];

  console.log("Deploying contract with constructor arguments:", {
    initialMintFee: initialMintFee.toString(),
  });

  const FarcasterFamilyTree = await FarcasterFamilyTreeFactory.deploy(initialMintFee);

  await FarcasterFamilyTree.waitForDeployment();

  console.log(`ReligiousWarplet contract deployed to address: ${await FarcasterFamilyTree.getAddress()}`);

  console.log("\nWaiting for 5 block confirmations before verification...");
  const deployTx = FarcasterFamilyTree.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5);
  }
  console.log("5 block confirmations received.");

  console.log("\nVerifying contract on the blockchain explorer...");
  try {
    await run("verify:verify", {
      address: await FarcasterFamilyTree.getAddress(),
      constructorArguments: constructorArgs,
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed.", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
