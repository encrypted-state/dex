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
  const permit = await getPermit(contractAddress, provider!);

  return permit;
}

export async function revokePermits(
  contractAddress: string,
  fhenix: FhenixClient,
  provider: EthersProvider,
) {
  removePermit(contractAddress);

  return new FhenixClient({ provider });
}
