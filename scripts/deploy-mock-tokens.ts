const hre = require("hardhat");

async function deployMockToken(name, symbol, dripAmount) {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];
  
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  
  const mockToken = await MockToken.connect(contractOwner).deploy(name, symbol, dripAmount);
  await mockToken.waitForDeployment();
  
  console.log(`${name} deployed to: ${await mockToken.getAddress()}`);

}

async function deployMockTokens() {
  await deployMockToken("Uniswap", "UNI", 80);
  await deployMockToken("DAI", "DAI", 1000);
  await deployMockToken("USD Coin", "USDC", 1000);
  await deployMockToken("Link", "LINK", 50);
  await deployMockToken("MATIC", "MATIC", 1000);
}

deployMockTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
