import { ethers, run } from "hardhat";
import { parseEther } from "ethers";

async function main() {
  console.log("Preparing to deploy the Xmas contract...");

  const XmasFactory = await ethers.getContractFactory("Xmas");

  // --- Contract Constructor Arguments ---
  const initialMintFee = parseEther("0");
  const constructorArgs = [initialMintFee];

  console.log("Deploying contract with constructor arguments:", {
    initialMintFee: initialMintFee.toString(),
  });

  const Xmas = await XmasFactory.deploy(initialMintFee);

  await Xmas.waitForDeployment();

  console.log(`Xmas contract deployed to address: ${await Xmas.getAddress()}`);

  console.log("\nWaiting for 5 block confirmations before verification...");
  const deployTx = Xmas.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5);
  }
  console.log("5 block confirmations received.");

  console.log("\nVerifying contract on the blockchain explorer...");
  try {
    await run("verify:verify", {
      address: await Xmas.getAddress(),
      constructorArguments: constructorArgs,
      contract: "contracts/Xmas.sol:Xmas",
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
