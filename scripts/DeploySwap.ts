const hre = require("hardhat");

async function deploy() {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  const name1 = "FHENIX";
  const symbol1 = "FHE";
  const name2 = "FHENIX2";
  const symbol2 = "FHE2";

  const FHERC20 = await hre.ethers.getContractFactory("FHERC20");
  const Factory = await hre.ethers.getContractFactory("Factory");
  const Router = await hre.ethers.getContractFactory("Router");

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

  const factory = await Factory.connect(contractOwner).deploy();
  await factory.waitForDeployment();

  console.log(`AMM deployed to: ${await factory.getAddress()}`);

  const router = await Router.connect(contractOwner).deploy(
    await factory.getAddress(),
  );
  await router.waitForDeployment();

  console.log(`Router deployed to: ${await router.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
