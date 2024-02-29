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

  // ERC20 deployed to: 0x88Ae075C0483c471F03d239e6E7a503bD3Bf133B
  // ERC20 deployed to: 0x1e1b2A3094163fAE55eF1efCC7DECbEf638a5b80
  // AMM deployed to: 0x2d768d26F9b3f7B588FDF7C8744825385B3aE1F0
  // Router deployed to: 0x66508D54e296E523949e254a7CfE09Bf8b8094D2

  const token1Address = "0x19D4341C2C69081ef0BA7e6417E5B970f318b449";
  const token2Address = "0x7a69D0860E103761C9D8820a43e8290E1E4519BE";
  const factoryAddress = "0xCE2b5e2F21868E11a66d28a331c7FF11f9ECF0d0";
  const routerAddress = "0x9f93A2e176e80d6D0795D29177c89A661192921b";
  // const pairAddress = "0x9Bc6f65E6cFC2d4a45a96ab0358173966616C3c8";
  const provider = hre.ethers.provider;
  const instance = new FhenixClient({ provider });

  const router = await hre.ethers.getContractAt("Router", routerAddress);
  const factory = await hre.ethers.getContractAt("Factory", factoryAddress);

  const amount1 = await instance.encrypt_uint16(50);
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
