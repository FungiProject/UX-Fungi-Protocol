import { UserOperationCallData } from "@alchemy/aa-core";
import { Hex } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { helperToast } from "../helperToast";
import { getErrorMessage } from "../contracts/transactionErrors";
import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "../../config/chains";
import { Alchemy, Network } from "alchemy-sdk";
import { BigNumber } from "alchemy-sdk";


export async function sendUserOperations(alchemyProvider: AlchemyProvider, chainId: number, userOperations: Exclude<UserOperationCallData, Hex>[]) {

    try{

        //if(userOperations || userOperations )

        console.log(userOperations)
        /*const alchemy = new Alchemy(
            {
            apiKey: "wa9SqZ2OET5sVzUtzMZUu-WGuwx85Xdt", 
            network: Network.ARB_MAINNET,
        })

        let {lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas, gasPrice} = await alchemy.core.getFeeData()

        //console.log(response)
        const newMaxFeePerGas = maxFeePerGas?.add(maxFeePerGas.mul(BigNumber.from(10)).div(BigNumber.from(100))); //+10%
        const newMaxPriorityFeePerGas = maxPriorityFeePerGas?.add(maxPriorityFeePerGas.mul(BigNumber.from(10)).div(BigNumber.from(100)));;

        console.log(maxFeePerGas?.toNumber())
        console.log(maxPriorityFeePerGas?.toNumber())
        console.log(newMaxFeePerGas?.toNumber())
        console.log(newMaxPriorityFeePerGas?.toNumber())*/
       

        const uo = await alchemyProvider.sendUserOperation(userOperations)
        const txHash = await alchemyProvider.waitForUserOperationTransaction(uo.hash);

        console.log(txHash)

        const txUrl = getExplorerUrl(chainId) + "tx/" + txHash;
        const sentMsg = `Transaction sent.`;

        helperToast.success(
            <div>
            {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink>
            <br />
            {/*opts.detailsMsg && <br />}
            {opts.detailsMsg*/}
            </div>
        );
    
    } catch(e: any){
        console.error(e);
        const { failMsg, autoCloseToast } = getErrorMessage(
            chainId,
            e,
            undefined
          );
        helperToast.error(failMsg, { autoClose: autoCloseToast });
        throw e;
    }

}