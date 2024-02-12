// React
import React, { useEffect, useState } from "react";
import { assetType, tokenType } from "@/types/Types";
import { TokenRebalanceInput } from "./Rebalancer";
import { XMarkIcon } from "@heroicons/react/24/outline";

type TokenCardProps = {
    token: TokenRebalanceInput;
    isSelected: boolean;
    onSelected: (token: tokenType | null) => void;
    onRemove: (token: tokenType) => void;
};

export default function TokenCardRebalance({ token, isSelected, onSelected, onRemove }: TokenCardProps) {

    const setSelected = () => {
        onSelected(!isSelected ? token : null)
    }

    const setRemove = () => {
        onRemove(token)
    }

    return (
        <div className="relative rounded-xl text-black items-center w-full outline-none placeholder:text-black bg-white flex shadow-searchBar my-[16px] ">
            <button
                className={`py-2 px-4 rounded-xl w-full hover:bg-gray-100 ${isSelected && 'bg-gray-300'} flex justify-between items-center text-start`}
                onClick={setSelected}
            >
                <div className="flex">
                    <img
                        width={46}
                        height={46}
                        alt={token.coinKey}
                        src={token.logoURI}
                        aria-hidden="true"
                        className="mr-6 rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="text-md">{token.name}</span>
                        <span className="text-sm text-black/60">{token.symbol}</span>
                    </div>
                </div>
                <span className="text-sm">{token.percentage} %</span>
            </button>
            <button
                type="button"
                className="absolute top-0 right-0 mr-2 rounded-md bg-white hover:text-gray-700 text-black focus:outline-none"
                onClick={setRemove}
            >
                <span className="sr-only">Close</span>
                <XMarkIcon
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                />
            </button>
        </div>
    );
}
