import React from "react";
import { useState } from "react";
import Logo from "../images/logo.png";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useContract } from "wagmi";

const Header = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { connector: activeConnector, isConnected } = useAccount();
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div className="">
        <header style={{ backgroundcolor: "transparent" }}>
          <nav className="mx-auto flex items-center justify-between gap-x-6 p-6 max-w-screen lg:px-8">
            <div className="flex">
              <a
                className="-m-1.5 p-1.5 text-white flex justify-center items-center "
                href="/"
              >
                <span className="sr-only">Your Company</span>
                <img className="w-24 h-24" src={Logo} alt="Tito" />
              </a>
            </div>

            <div className="items-center justifybox height same and content size same, Its difficult to manage the ssection becuase images sizes is too much, if i set the images its look strechable -end  gap-x-4 lg:flex xl:gap-x-8">
              {/* <button className="rounded-md text-white shadow-sm bg-transparent font-bold border border-neutral-500 py-3 px-4 text-[10px] xl:py-4 xl:px-8 xl:text-sm transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300">Dashboard</button> */}
              <button
                onClick={() => open()}
                className="rounded-md text-white shadow-sm bg-transparent font-bold border border-neutral-500 py-3 px-4 text-[10px] xl:py-4 xl:px-8 xl:text-sm transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300"
              >
                {!isConnected
                  ? "Connect Wallet"
                  : "0x..." + `${address?.slice(-6)}`}
              </button>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
};

export default Header;
