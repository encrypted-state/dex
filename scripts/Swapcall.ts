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

  const token1Address = "0x8A2403EaB830Bb23FF669afD41B63f75b0A5e5C9";
  const token2Address = "0x990976A5F11A5164A8CBeb2D08f63a78c4927316";
  const factoryAddress = "0xA84C576ec3BD79f81fC617c55926dEdE15bb4C0d";
  const routerAddress = "0x77BB92d511d41dAd1C7bF7292b9f8093204da008";
  // const pairAddress = "0x9Bc6f65E6cFC2d4a45a96ab0358173966616C3c8";
  const provider = hre.ethers.provider;
  const instance = new FhenixClient({ provider });

  const router = await hre.ethers.getContractAt("Router", routerAddress);
  const factory = await hre.ethers.getContractAt("Factory", factoryAddress);

  const amount1 = await instance.encrypt_uint16(1000);
  const amount2 = await instance.encrypt_uint16(1000);
  const token1 = await hre.ethers.getContractAt("FHERC20", token1Address);
  const token2 = await hre.ethers.getContractAt("FHERC20", token2Address);

  const permitToken1 = await getPermit(token1Address, provider);
  instance.storePermit(permitToken1);
  const permissionToken1 = instance.extractPermitPermission(permitToken1);

  const permitToken2 = await getPermit(token2Address, provider);
  instance.storePermit(permitToken2);
  const permissionToken2 = instance.extractPermitPermission(permitToken2);

  const eBalance1BeforeMint = await token1.balanceOfSealed(
    contractOwner.address,
    permissionToken1,
  );
  const balance1BeforeMint = instance.unseal(
    token1Address,
    eBalance1BeforeMint,
  );
  console.log("token1 balance before mint: ", balance1BeforeMint);

  const eBalance2BeforeMint = await token2.balanceOfSealed(
    contractOwner.address,
    permissionToken2,
  );
  const balance2BeforeMint = instance.unseal(
    token2Address,
    eBalance2BeforeMint,
  );
  console.log("token2 balance before mint: ", balance2BeforeMint);

  const mint1 = await token1.mintEncrypted(amount1);
  mint1.wait();
  console.log("token1 minted");

  const mint2 = await token2.mintEncrypted(amount2);
  mint2.wait();
  console.log("token2 minted");

  const approve1 = await token1.approveEncrypted(routerAddress, amount1);
  approve1.wait();
  console.log("token 1 approved");

  const approve2 = await token2.approveEncrypted(routerAddress, amount2);
  approve2.wait();

  console.log("token 2 approved");

  const eBalance1BeforeLP = await token1.balanceOfSealed(
    contractOwner.address,
    permissionToken1,
  );
  const balance1BeforeLP = instance.unseal(token1Address, eBalance1BeforeLP);
  console.log("token1 balance before LP: ", balance1BeforeLP);

  const eBalance2BeforeLP = await token2.balanceOfSealed(
    contractOwner.address,
    permissionToken2,
  );
  const balance2BeforeLP = instance.unseal(token2Address, eBalance2BeforeLP);
  console.log("token2 balance before LP: ", balance2BeforeLP);

  const lpamount = await instance.encrypt_uint16(100);

  const addLiquidity = await router.addLiquidity(
    token1Address,
    token2Address,
    lpamount,
    lpamount,
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

  const ebalancePairtoken1 = await token1.balanceOfEncrypted(pairAddress);
  console.log("token1 balance after LP: ", ebalancePairtoken1);
  const ebalancePairtoken2 = await token2.balanceOfEncrypted(pairAddress);
  console.log("token2 balance after LP: ", ebalancePairtoken2);

  const eBalance = await pair.balanceOfSealed(
    contractOwner.address,
    permission,
  );
  const balance = instance.unseal(pairAddress, eBalance);
  console.log("LP balance: ", balance);

  const eBalance1Before = await token1.balanceOfSealed(
    contractOwner.address,
    permissionToken1,
  );
  const balance1Before = instance.unseal(token1Address, eBalance1Before);
  console.log("token1 balance before: ", balance1Before);

  const eBalance2Before = await token2.balanceOfSealed(
    contractOwner.address,
    permissionToken2,
  );
  const balance2Before = instance.unseal(token2Address, eBalance2Before);
  console.log("token2 balance before: ", balance2Before);

  const swapAmount = await instance.encrypt_uint16(50);

  const approveswap = await token1.approveEncrypted(routerAddress, swapAmount);
  approveswap.wait();
  console.log("token 1 swapapproved");

  const swap = await router.swapExactTokensForTokens(
    swapAmount,
    [token1Address, token2Address],
    contractOwner.address,
    { gasLimit: 900000000 },
  );
  swap.wait();

  const eBalance1After = await token1.balanceOfSealed(
    contractOwner.address,
    permissionToken1,
  );
  const balance1After = instance.unseal(token1Address, eBalance1After);
  console.log("token1 balance after swap: ", balance1After);

  const eBalance2After = await token2.balanceOfSealed(
    contractOwner.address,
    permissionToken2,
  );
  const balance2After = instance.unseal(token2Address, eBalance2After);
  console.log("token2 balance after swap: ", balance2After);

  const ebalancePairtoken1Swapp = await token1.balanceOfEncrypted(pairAddress);
  console.log("token1 balance pair after swap: ", ebalancePairtoken1Swapp);

  const ebalancePairtoken2Swapp = await token2.balanceOfEncrypted(pairAddress);
  console.log("token2 balance pair after swap: ", ebalancePairtoken2Swapp);

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
