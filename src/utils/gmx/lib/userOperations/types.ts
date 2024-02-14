import { Hex } from "@alchemy/aa-core";
import { UserOperationCallData } from "@alchemy/aa-core";
import { BigNumber } from "ethers";

export type UserOperation = Exclude<UserOperationCallData, Hex>;
