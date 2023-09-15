import React, { useEffect, useState } from "react";
import blockaudit from "../images/blockaudit.jpg";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import connectContract,{stakingContract,aaveContract} from "../connectContract"
import { ethers } from "ethers";
const Hero = () => {
  connectContract();
  const [durationIndex, setDurationIndex] = useState();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isApproved, setIsApproved] = useState();
  const [txDone, setTxDone] = useState(false);
  const [loader, setLoader] = useState(false);
  const { address, isConnected } = useAccount();
  const[totalStaked, setTotalStaked] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const approveAmount ="115792089237316195423570985008687907853269984665640564039457584007913129639935"

  const checkApproval = async () => {
    try{
      const Amount = await aaveContract.allowance(address, stakingContract.address);
      if(Number(ethers.utils.formatEther(Amount)) < Number(tokenAmount)){
        setIsApproved(false);
      }
      else{
        setIsApproved(true);
      }
    }catch(err){
      console.log("err in checkApproval : ", err);
    }
  }

  useEffect(()=>{
    checkApproval();
  },[tokenAmount, txDone, isConnected, address])

  
  
  const handlesubmit = async (e) => {
    if(isConnected){
          try {
          if(!isApproved){
            try{
              setLoader(true);
              const tx1 = await aaveContract.approve(stakingContract.address, approveAmount);
              const data = await tx1.wait();
              setLoader(false);
              setTxDone(!txDone);
              
            }catch(err){
              setLoader(false);
              alert(err.message||err||err.data);
              
            }
          }
          else{
            try{
              setLoader(true);
              if(durationIndex == undefined){setLoader(false); alert("Please select duration"); return;}
              const tx2 = await stakingContract.stakePool(ethers.utils.parseEther(tokenAmount), durationIndex);
              const data = await tx2.wait();
              setLoader(false);
              setTxDone(!txDone);
              
            }catch(err){
              setLoader(false);
              alert(err.reason);
              
            }
          }
        } catch (error) {
            console.log("error in tx1: ", error);
        }
        }
        else{
            alert("Please connect wallet");
            
        }
        
        
  }

  const handleMax = async () => {
    try{
      const balance = await aaveContract.balanceOf(address);
      console.log("balance : ", balance);
      setTokenAmount(ethers.utils.formatEther(balance));
    }catch(err){
      console.log( err);
    }
  }

  const getData = async () => {
    try{
      const balance = await aaveContract.balanceOf(address);
      setBalance(Number(ethers.utils.formatEther(balance)).toFixed(2));
      const staked = await stakingContract.userTotalStake(address);
      setStakedAmount(Number(ethers.utils.formatEther(staked)).toFixed(2));
      const total = await stakingContract.totalStaked();
      setTotalStaked(Number(ethers.utils.formatEther(total)).toFixed(2));
    }catch(err){
      console.log("err in getData : ", err);
    }
  }
  useEffect(()=>{
    getData();
  },[txDone,address,isConnected,durationIndex])

  useEffect(()=>{
    if(txDone){
      window.location.reload();
    }
    
  },[txDone])

  return (
    <>
      <div className="HeroBg bg-cover bg-vulcan bg-no-repeat bg-center mt-[-105px] md:mt-[-131px] px-3 pt-40 pb-12 lg:block xl:px-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="lg:grid max-w-7xl mx-auto gap-x-10 grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-y-0 xl:gap-x-20 flex flex-col flex-col-reverse ">
          <div className="grid items-center">
            <div className="space-y-4 md:space-y-7">
              <h1 className="font-bold text-white text-2xl md:text-3xl lg:text-4xl xl:text-6xl uppercase">
                Stake <span className=" text-fuchsia-600">Harvest</span>
              </h1>
              <p className="text-white">
                - Only staked AAVE will be considered for all the upcoming Sales
                in the Anypad Ecosystem.
              </p>
              <p className="text-white">
                - Earn attractive APY on your staked AAVE tokens
              </p>

              <div className="text-white">
                <table className="border-solid border-2 border-white  w-full text-center p-4 sm:w-2/3  h-60 ">
                  <thead className="h-16">
                    <tr className="border-solid border-2 border-white">
                      <th className="border-white border-solid border-2 m-2">
                        Staking pools (Duration)
                      </th>
                      <th>Rewards (APY)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-solid border-2 border-white ">
                      <td className="border-solid border-2 border-white ">
                        15 Days
                      </td>
                      <td>45%</td>
                    </tr>
                    <tr className="border-solid border-2 border-white ">
                      <td className="border-solid border-2 border-white ">
                        30 Days
                      </td>
                      <td>55%</td>
                    </tr>
                    <tr className="border-solid border-2 border-white ">
                      <td className="border-solid border-2 border-white ">
                        65 Days
                      </td>
                      <td>78%</td>
                    </tr>
                    <tr className="border-solid border-2 border-white ">
                      <td className="border-solid border-2 border-white ">
                        90 Days
                      </td>
                      <td>103.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-white">How to Participate:</p>
              <div className="text-white">
                <ol>
                  <li>
                    1. Choose a duration and enter the amount you wish to stake
                    and take part in the upcoming sale.
                  </li>
                  <li>
                    2. Click Approve to approve your AAVE to be used on the
                    platform and then Stake the desired number of AAVE.
                  </li>
                  <li>3. Thats it!!</li>
                </ol>
              </div>
              <p className="text-white">
                NOTE: Staking doesn’t give you the whitelist for the project.
                For whitelisting, please give your consent to participate in
                that particular sale you wish to participate.
              </p>
              <div className="flex gap-x-4 xl:gap-x-8">
                <span className="flex rounded-md items-center space-x-3 bg-gradient-to-r from-sky-600 to-fuchsia-600 py-2 px-4 lg:px-6 xl:py-4 xl:px-8  transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300">
                  <img alt="blockaudit" className="w-8 h-8" src={blockaudit} />
                  <a
                    className="font-bold text-white text-xs xl:text-sm"
                    href="https://whitepaper.borroe.finance/token-overview/smart-contract-audit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Smart Contract
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="  border border-neutral-500 rounded-xl py-8 bg-black bg-opacity-30 mb-6 h-max">
            <div className="bg-transparent text-center px-4 py-2 sm:pt-3 sm:px-18"></div>
            <div className="overflow-hidden rounded-b-xl text-white bg-transparent shadow">
              <div className="px-4 pb-4 bg-transparent bg-opacity-70  lg:px-6 3xl:px-10 ">
                <div className="flex flex-col md:flex-row justify-around px-8 text-fuchsia-600 font-bold text-sm mt-3 md:mt-0">
                  <div className="text-2xl">Choose a staking duration</div>
                </div>
                <br />

                <div className="px-2 bg-transparent lg:px-2">
                  <div className="p-2 sm:p-0 flex flex-col items-center mb-2 lg:mb-5"></div>
                  <div className="grid gap-2  grid-cols-4  justify-center items-center self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setDurationIndex(0);
                      }}
                      //   className="mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 "
                      className={
                        durationIndex === 0
                          ? "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold   text-white leading-6 shadow-sm bg-gradient-to-r  from-sky-600 to-fuchsia-600 "
                          : "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 "
                      }
                    >
                      15 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDurationIndex(1);
                      }}
                      className={
                        durationIndex === 1
                          ? "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold   text-white leading-6 shadow-sm bg-gradient-to-r  from-sky-600 to-fuchsia-600 "
                          : "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 "
                      }
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDurationIndex(2);
                      }}
                      className={
                        durationIndex === 2
                          ? "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold   text-white leading-6 shadow-sm bg-gradient-to-r  from-sky-600 to-fuchsia-600 "
                          : "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 "
                      }
                    >
                      65 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDurationIndex(3);
                      }}
                      className={
                        durationIndex === 3
                          ? "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold   text-white leading-6 shadow-sm bg-gradient-to-r  from-sky-600 to-fuchsia-600 "
                          : "mb-2 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-2 sm:px-1.5 sm:py-3.5 3xl:py-4 4xl:py-5 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 "
                      }
                    >
                      90 Days
                    </button>
                  </div>
                  <br />

                  <div className="flex justify-between flex-col md:flex-row">
                    <div className=" flex justify-between items-center  block w-full rounded-md border-0 py-2.5 sm:py-1.5 pl-4 pr-10 text-white  bg-gradient-to-r from-gray-900 to-gray-800  shadow-sm ring-1 ring-inset ring-blue-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-base font-medium sm:leading-10">
                      <input
                        type="number"
                        name="token"
                        id="token"
                        value={tokenAmount}
                        onChange={(e) => {
                          e.preventDefault();

                          setTokenAmount(e.target.value);
                        }}
                        className="  block w-full text-white placeholder:text-gray-400  sm:text-base font-medium sm:leading-10 bg-transparent outline-none "
                      />
                      <button
                        type="button"
                        className=" w-1/6 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1 sm:px-1.5 sm:py-2.5 3xl:py-2 4xl:py-3 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 mt-1 mb-1"
                        onClick={handleMax}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  <br />
                  <div className="flex justify-center items-center w-full flex-col">
                    <div className="flex justify-between items-center m-1 w-full">
                      <div>APY</div>
                      <div>30%</div>
                    </div>
                    <div className="flex justify-between items-center m-1 w-full">
                      <div>Your staked</div>
                      <div>{stakedAmount}</div>
                    </div>
                    <div className="flex justify-between items-center m-1 w-full">
                      <div>Your Balance</div>
                      <div>{balance}</div>
                    </div>
                    <div className="flex justify-between items-center m-1 w-full">
                      <div>Total staked</div>
                      <div>{totalStaked}</div>
                    </div>
                  </div>
                  <br />

                  <button
                    disabled={loader}
                    onClick={handlesubmit}
                    className="sm:mt-2 mb-2 w-full inline-flex items-center justify-center whitespace-nowrap border-0 rounded-md px-5 py-2 sm:px-5 sm:py-5 3xl:py-4 4xl:py-5 text-sm sm:text-md  font-semibold text-white leading-5 shadow-sm  bg-gradient-to-r from-sky-600 to-fuchsia-600 hover:bg-blue-900"
                  >
                    {loader?"Processing...":isApproved ? "Stake" : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Hero;
