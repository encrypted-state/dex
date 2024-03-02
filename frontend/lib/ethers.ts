// ethersAdapter.ts

import { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useMemo } from 'react';
import type { Chain, Client, Transport } from 'viem';
import { type Config, useClient, useConnectorClient } from 'wagmi';

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      (transportInstance) => new JsonRpcProvider(transportInstance.value?.url, network),
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  
  return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a Viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient<Config>({ chainId });
  return useMemo(() => client ? clientToProvider(client) : undefined, [client]);
}

export function clientToSigner(client: Client<Transport, Chain>) {
    const { account, chain, transport } = client;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (!account) {
      throw new Error('Account is undefined');
    }
    const provider = new Web3Provider(transport as any, network); // Cast to 'any' due to type mismatch
    const signer = provider.getSigner(account.address);
    return signer;
  }

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
