import React from 'react';
import { usePublicClient } from 'wagmi';
import { providers } from 'ethers';
import { HttpTransport } from 'viem';

export function publicClientToProvider(publicClient) {
  const { chain, transport } = publicClient;
  console.log('publicClientToProvider', publicClient);
  const network = {
    chainId: chain.id,
    name: chain.name,
    
  };

  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      transport.transports.map(({ value }) => new providers.JsonRpcProvider(value?.url, network))
    );
  } else {
    return new providers.JsonRpcProvider(transport.url, network);
  }
}

export function UseEthersProvider({ chainId } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}
