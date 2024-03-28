import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { UserOperation } from "./types";
import axios from "axios";
import { getAlchemyApiUrl, getApiKeyChain } from "@/config/alchemyConfig";

export async function estimateGasUserOp(
    alchemyProvider: AlchemySmartAccountClient,
    userOperations: UserOperation[]
) {
    try {
        if (userOperations.length === 0) {
            throw new Error("userops 0");
        }

        /*const userOpBuild = await Promise.all(userOperations.map(async (userOp) => {
            return await alchemyProvider.buildUserOperation({ uo: userOp });
        }));


        axios.post(`${getAlchemyApiUrl(alchemyProvider.chain!.id!)}${getApiKeyChain(alchemyProvider.chain!.id!)}`, {
            id: 1,
            jsonrpc: "2.0",
            method: "eth_estimateUserOperationGas",
            params: [...userOpBuild]

        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        })
            .then(response => {
                console.log('Response:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });*/

    } catch (e: any) {
        console.log(e);
    }
}