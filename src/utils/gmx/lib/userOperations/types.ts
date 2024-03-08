import { Hex } from "@alchemy/aa-core";
import { UserOperationCallData } from "@alchemy/aa-core";

export type UserOperation = Exclude<UserOperationCallData, Hex>;
