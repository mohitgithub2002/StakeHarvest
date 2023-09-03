import React, { useEffect } from "react";
import {stakingContract} from "../connectContract"
import { useAccount } from "wagmi";
import { ethers } from "ethers";
const Community = () => {
    const { address , isConnected} = useAccount();
    const [txData,setTxData] = React.useState([]);
    const [selecttx,setSelectTx] = React.useState();
    const showtx = async () =>{
        try{
            const tx = await stakingContract.getUserStake(address);
            console.log("tx",tx);
            const data = [];
            tx.forEach((item,index)=>{
                var stakeDate = new Date(item.StakeTime*1000);
                var unstakeDate = new Date(item.MaturityTime*1000);
                var days
                switch(Number(item.Duration)){
                    case 0: days = 15; break;
                    case 1: days = 30; break;
                    case 2: days = 65; break;
                    case 3: days = 90; break;
                }
                console.log("date",stakeDate.toUTCString());
                data.push({
                    duration: item.Duration.toString(),
                    days: days,
                    amount: Number(ethers.utils.formatEther(item.Amount)).toFixed(2),
                    stakedAt: `${stakeDate.toDateString()}  ${stakeDate.toLocaleTimeString()}`,
                    canUnstakeAt: `${unstakeDate.toDateString()}  ${unstakeDate.toLocaleTimeString()}`
                    
                })      
            })
            setTxData(data);
        }catch(err){
            console.log(err);
        }
    }

    const handleClaim = (index) => async () =>{
        console.log("index",index);
        const stakeIndex = txData.length - index - 1;
        try{
            const tx = await stakingContract.DailyClaim(stakeIndex);
            console.log("tx",tx);
            const data = await tx.wait();
            console.log("data",data);
        }catch(err){
            console.log(err);
        }
        
    }
    console.log("tx data",txData)
    useEffect(()=>{
        showtx();
    },[isConnected,address])
    return (
        <>
            <div className="px-3 py-4 bg-vulcan pb-20">
                <div className="max-w-7xl mx-auto rounded-lg grid  text-center bg-gradient-to-r from-gray-900 to-gray-800  pb-16 overflow-x-auto filter">

                    <p className="w-full pl-10 text-start sm:text-center sm:items-center text-white pb-4 font-semibold mt-4 text-3xl lg:mt-8">Stake history</p>


                    <table className="  w-full text-center py-4"  >
                        <thead className=" w-full">
                            <tr className="gap-2 w-full text-sky-600  ">
                                <th className="px-20 py-3">Duration</th>
                                <th className="px-20 py-3">Amount</th>
                                <th className="px-20 py-3">Staked at</th>
                                <th className="px-20 py-3">Can unstake at</th>
                                <th className="px-20 py-3">Claim</th>

                            </tr>
                        </thead>
                        <tbody className="text-white ">
                            {txData.length === 0 ? <tr><td colSpan="5">No Data</td></tr> :
                            (txData.slice().reverse().map((item, index) =>(
                            <tr key={index} className=" h-10">
                                <td >{`${item.days} Days`}</td>
                                <td>{item.amount}</td>
                                <td>{item.stakedAt}</td>
                                <td>{item.canUnstakeAt}</td>
                                <td><button onClick={handleClaim(index)} type="button" className=" w-20  items-center justify-center whitespace-nowrap rounded-md px-1 py-1 sm:px-2 sm:py-2 3xl:py-2 4xl:py-3 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600" l>
                                    Claim</button></td>
                                
                            </tr>
                            
                            )))
                            }
                            
                            {/* <tr >
                                <td >30 Days</td>
                                <td>500.00</td>
                                <td>25-Aug-2023 12:15 AM</td>
                                <td>30-Aug-2023 12:15 AM</td>
                                <td><button type="button" className=" w-20  items-center justify-center whitespace-nowrap rounded-md px-1 py-1 sm:px-2 sm:py-2 3xl:py-2 4xl:py-3 text-xs sm:text-xs font-semibold text-neutral-900 hover:text-white leading-6 shadow-sm bg-gradient-to-r to-fuchsia-200 from-blue-100 hover:from-sky-600 hover:to-fuchsia-600 ">
                                    Claim</button></td>
                            </tr> */}

                        </tbody>
                    </table>


                </div>
            </div>
        </>
    );
}

export default Community;