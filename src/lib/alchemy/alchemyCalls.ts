import { Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";

export async function getTokenBalancesAlchemy(alchemyClient: Alchemy, address: string) {
    if(!alchemyClient || !address){
        return
    }
   const response = await alchemyClient.core.getTokenBalances(address);

   const ethBalance = await alchemyClient.core.getBalance(address)

   if(ethBalance && ethBalance.gt("0")) {
       response?.tokenBalances.push({contractAddress: ethers.constants.AddressZero, tokenBalance: ethBalance.toString()})
   }


   if (response && response?.tokenBalances){
    return response.tokenBalances
   }
}