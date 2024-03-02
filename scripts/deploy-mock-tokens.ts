const hre = require("hardhat");

async function deployMockToken(name, symbol) {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];
  
  const MockToken = await hre.ethers.getContractFactory("FHERC20");
  
  const mockToken = await MockToken.connect(contractOwner).deploy(name, symbol);
  await mockToken.waitForDeployment();
  
  console.log(`${name} deployed to: ${await mockToken.getAddress()}`);

}

async function deployMockTokens() {
  await deployMockToken("Uniswap", "UNI");
  await deployMockToken("DAI", "DAI");
  await deployMockToken("USD Coin", "USDC");
  await deployMockToken("Link", "LINK");
  await deployMockToken("MATIC", "MATIC");
}

deployMockTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
