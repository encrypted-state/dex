import {
  EthersProvider,
  FhenixClient,
  getPermit,
  removePermit,
} from "fhenixjs";

export async function generatePermits(
  contractAddress: string,
  provider: EthersProvider,
) {
  console.log(provider);
  const fhenix = new FhenixClient({ provider });
  const permit = await getPermit(contractAddress, provider!);

  fhenix.storePermit(permit);

  return fhenix;
}

export async function revokePermits(
  contractAddress: string,
  fhenix: FhenixClient,
  provider: EthersProvider,
) {
  removePermit(contractAddress);

  return new FhenixClient({ provider });
}
