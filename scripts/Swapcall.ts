import { FhenixClient, Permit, getPermit, removePermit } from "fhenixjs";

const hre = require("hardhat");

async function getCounter() {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  //   ERC20 deployed to: 0xbD588697710EFC816290ec916878CAadDD7BAd80
  //   ERC20 deployed to: 0xBfA033992417ba2bC1382b1069427C6Ba586cc73
  //   AMM deployed to: 0x061b6754C1DcA6b9A51fd82D3A5669c99dEA6088

  const token1Address = "0xCc8694BbAeFEAc5808dA75083cB9f67eCdE629A9";
  const token2Address = "0x715F5fB93606b47718765e233c316c2959980D40";
  const contractAddress = "0x9270a14105D0f8a65FEc0C7C26d483F36930c5f2";
  const provider = hre.ethers.provider;
  const instance = new FhenixClient({ provider });

  const permit = await getPermit(contractAddress, provider);

  instance.storePermit(permit);
  const permission = instance.extractPermitPermission(permit);

  const AMM = await hre.ethers.getContractAt("SwapPair", contractAddress);

  const amount1 = await instance.encrypt_uint16(100);
  const amount2 = await instance.encrypt_uint16(100);
  const token1 = await hre.ethers.getContractAt("FHERC20", token1Address);
  const token2 = await hre.ethers.getContractAt("FHERC20", token2Address);

  const mint1 = await token1.mintEncrypted(amount1);
  mint1.wait();
  console.log("token1 minted");

  const mint2 = await token2.mintEncrypted(amount2);
  mint2.wait();
  console.log("token2 minted");

  const initialize = await AMM._initialize(token1Address, token2Address);
  initialize.wait();

  console.log("AMM initialized");

  const lpmint = await AMM["mint(address)"](contractOwner.address);
  lpmint.wait();

  console.log("LP minted");

  const eBalance = await AMM.balanceOfSealed(contractOwner.address, permission);
  const balance = instance.unseal(contractAddress, eBalance);
  console.log("balance: ", balance);

  //   console.log("LP total supply:", await AMM.getTotalSupply());

  //   console.log("Approving...");
  //   const tx1 = await token1["approve(address,(bytes))"](
  //     contractAddress,
  //     amount1,
  //   );
  //   await tx1.wait();

  //   const tx2 = await token2["approve(address,(bytes))"](
  //     contractAddress,
  //     amount2,
  //   );
  //   await tx2.wait();

  //   console.log("Adding Liquidity...");
  //   const tx3 = await AMM.addLiquidity(amount1, amount2);
  //   await tx3.wait();

  //   console.log("Token 1 AMM Balance:", await token1.balance(contractAddress));
  //   console.log(
  //     "Token 1 EOA Balance:",
  //     await token1.balance(contractOwner.address),
  //   );

  //   console.log("Token 2 AMM Balance:", await token2.balance(contractAddress));
  //   console.log(
  //     "Token 2 EOA Balance:",
  //     await token2.balance(contractOwner.address),
  //   );

  //   const Ebalance = await AMM.balanceOf(permission);
  //   const balance = instance.unseal(contractAddress, Ebalance);
  //   console.log("user LP balance:", balance);

  //   const swapamount = await instance.encrypt_uint16(60);
  //   const tx5 = await token1["approve(address,(bytes))"](
  //     contractAddress,
  //     swapamount,
  //   );
  //   await tx5.wait();

  //   const tx6 = await AMM.swap(token1Address, swapamount);
  //   await tx6.wait();

  //   console.log("Token 1 AMM Balance:", await token1.balance(contractAddress));
  //   console.log(
  //     "Token 1 EOA Balance:",
  //     await token1.balance(contractOwner.address),
  //   );

  //   console.log("Token 2 AMM Balance:", await token2.balance(contractAddress));
  //   console.log(
  //     "Token 2 EOA Balance:",
  //     await token2.balance(contractOwner.address),
  //   );

  //   const Ebalance3 = await AMM.balanceOf(permission);
  //   const balance3 = instance.unseal(contractAddress, Ebalance3);
  //   console.log("user LP balance:", balance3);

  //   console.log("total supply:", await AMM.getTotalSupply());

  //   REMOVE LIQUIDITY TESTS

  // console.log("total supply:", await AMM.getTotalSupply());

  // console.log("Removing Liquidity...");

  // const tx4 = await AMM.removeLiquidity(await instance.encrypt_uint16(Number(balance)));
  // await tx4.wait();

  // console.log("Token 1 AMM Balance:", await token1.balance(contractAddress));
  // console.log("Token 1 EOA Balance:", await token1.balance(contractOwner.address));

  // console.log("Token 2 AMM Balance:", await token2.balance(contractAddress));
  // console.log("Token 2 EOA Balance:", await token2.balance(contractOwner.address));

  // const Ebalance2 = await AMM.balanceOf(permission);
  // const balance2 = instance.unseal(contractAddress, Ebalance2);
  // console.log("user LP balance:", balance2);

  // console.log("total supply:", await AMM.getTotalSupply());
}

if (require.main === module) {
  // === This is for deploying a new diamond ===
  getCounter()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
