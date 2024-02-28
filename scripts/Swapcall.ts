import { FhenixClient, Permit, getPermit, removePermit } from "fhenixjs";

const hre = require("hardhat");

async function Swapcall() {
  //STEPS:
  //   DEPLOY ERC20
  //   DEPLOY FACTORY
  //   DEPLOY ROUTER
  //   MINT ERC20
  //   APPROVE TOKENS TRANSFER
  //   CALL ADDLIQUIDITY
  //   CHECK TOKENS BALANCE
  //   CHECK LP BALANCE

  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];

  // ERC20 deployed to: 0x5C19A1cA4CB8a638e5578D0f5432fecCE1B8946e
  // ERC20 deployed to: 0xfeE9fF032366a5Ac61036688EDDd09b048d2aefE
  // AMM deployed to: 0xD141bEB3F976eeaF301c61C3CD19CAC21EfeA619
  // Router deployed to: 0xB5f4572983A8Dc787e04EAF4517793c7D30083aF

  const token1Address = "0x571111eA8f7F8a6C47b2A3880f4e8189A4345B87";
  const token2Address = "0x558167667d2B57b7C5977518bD09D6614eafA8c1";
  const factoryAddress = "0xd9592740135304fdF3DFEC6844A0778303a8650a";
  const routerAddress = "0xB03664C040cfb554D5bd79d19e3bF6e5ba82f5be";
  // const pairAddress = "0x9Bc6f65E6cFC2d4a45a96ab0358173966616C3c8";
  const provider = hre.ethers.provider;
  const instance = new FhenixClient({ provider });

  const router = await hre.ethers.getContractAt("Router", routerAddress);
  const factory = await hre.ethers.getContractAt("Factory", factoryAddress);

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

  const approve1 = await token1.approveEncrypted(factoryAddress, amount1);
  approve1.wait();
  console.log("token 1 approved");

  const approve2 = await token2.approveEncrypted(factoryAddress, amount2);
  approve2.wait();

  console.log("token 2 approved");

  const addLiquidity = await router.addLiquidity(
    token1Address,
    token2Address,
    amount1,
    amount2,
    amount1,
    amount2,
    contractOwner.address,
    { gasLimit: 900000000 },
  );
  addLiquidity.wait();

  console.log("liquidity added");

  const pairAddress = await factory.getPair(token1Address, token2Address);

  console.log("pairAddress", pairAddress);
  const permit = await getPermit(pairAddress, provider);
  instance.storePermit(permit);
  const permission = instance.extractPermitPermission(permit);

  const pair = await hre.ethers.getContractAt("SwapPair", pairAddress);

  const eBalance = await pair.balanceOfSealed(
    contractOwner.address,
    permission,
  );
  const balance = instance.unseal(pairAddress, eBalance);
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
  Swapcall()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
