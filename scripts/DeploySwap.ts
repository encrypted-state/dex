const hre = require("hardhat");

async function deploy() {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const name1 = "FHENIX";
  const symbol1 = "FHE";
  const name2 = "FHENIX2";
  const symbol2 = "FHE2";

  const FHERC20 = await hre.ethers.getContractFactory("FHERC20");
  const SWAP = await hre.ethers.getContractFactory("SwapPair");

  const encryptedERC20_1 = await FHERC20.connect(contractOwner).deploy(
    name1,
    symbol1,
  );
  await encryptedERC20_1.waitForDeployment();
  console.log(`ERC20 deployed to: ${await encryptedERC20_1.getAddress()}`);

  const encryptedERC20_2 = await FHERC20.connect(contractOwner).deploy(
    name2,
    symbol2,
  );
  await encryptedERC20_2.waitForDeployment();
  console.log(`ERC20 deployed to: ${await encryptedERC20_2.getAddress()}`);

  const amm = await SWAP.connect(contractOwner).deploy();
  await amm.waitForDeployment();

  console.log(`AMM deployed to: ${await amm.getAddress()}`);

  await amm._initialize(
    await encryptedERC20_1.getAddress(),
    await encryptedERC20_2.getAddress(),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
