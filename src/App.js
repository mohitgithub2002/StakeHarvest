import React, { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Community from "./components/Community";
import Footer from "./components/Footer";
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import {WalletConnectModal}from '@walletconnect/modal'
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { useAccount, useDisconnect } from 'wagmi'
import connectContract, {stackingContract, aaveContract} from "./connectContract";
const projectId = "6b098530af4797b4b0dcb37e0534845a";

const chains = [arbitrum, mainnet, polygon,polygonMumbai];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  
  
  
  

  return (
    <WagmiConfig config={wagmiConfig}>
      {/* Components that use the WagmiConfig context */}
      <Header />
      <Hero />
      <Community />
      <Footer />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}

export default App;
