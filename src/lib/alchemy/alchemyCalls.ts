import { AlchemyMultichainClient } from "@/lib/alchemy/AlchemyMultichainClient";
import { ethers } from "ethers";

export async function getTokenBalancesAlchemy(alchemyClient: AlchemyMultichainClient, chainId: number, address: string) {
    if(!alchemyClient || !chainId || !address){
        return
    }
   const response = await alchemyClient?.forNetwork(chainId)?.core.getTokenBalances(address);

   const ethBalance = await alchemyClient?.forNetwork(chainId)?.core.getBalance(address)

   if(ethBalance && ethBalance.gt("0")) {
       response?.tokenBalances.push({contractAddress: ethers.constants.AddressZero, tokenBalance: ethBalance.toString()})
   }


   if (response && response?.tokenBalances){
    return response.tokenBalances
   }
}