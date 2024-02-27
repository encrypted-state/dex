import { FhenixClient, Permit, getPermit, removePermit } from "fhenixjs";

const hre = require("hardhat");

async function getCounter() {
  const accounts = await hre.ethers.getSigners();
  const contractOwner = accounts[0];
  // ERC20 deployed to: 0x86b0b98CBF9535eeA71025256b17E85864ac5eb4
  // ERC20 deployed to: 0xb8D6a377800B2B45Efa620b986AE4eE00C389515
  // AMM deployed to: 0x86791902CD0ADeF51092361C4F1742d9Fe020FB3

  const token1Address = "0x86b0b98CBF9535eeA71025256b17E85864ac5eb4";
  const token2Address = "0xb8D6a377800B2B45Efa620b986AE4eE00C389515";
  const contractAddress = "0x86791902CD0ADeF51092361C4F1742d9Fe020FB3";
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

  const lpmint = await AMM["mint(address)"](contractOwner);
  lpmint.wait();

  const eBalance = await AMM.balanceOfSealed(contractAddress, permission);
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
