import React, { useEffect, useMemo, useState } from "react";
import Button from "../Gmx/common/Buttons/Button";
import TokenDropdown from "../Dropdown/TokenDropdown";
import {
  assetsArbitrum
} from "../../../constants/Constants";
import { tokenType } from "@/types/Types";
import RebalanceTokensSelected from "./RebalanceTokensSelected";
import TokenCardRebalance from "./TokenCardRebalance";
import RebalanceSlider from "../Sliders/RebalanceSlider";

type RebalancerProps = {
  tokens: tokenType[];
  chainId: number;
};


export interface TokenRebalanceInput extends tokenType {
  percentage: number
}

export default function Rebalancer({ tokens, chainId }: RebalancerProps) {

  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTokens, setSelectedTokens] = useState<TokenRebalanceInput[]>([])
  const [onFocusToken, setOnFocusToken] = useState<TokenRebalanceInput | null>()
  const [tokensOptions, setTokensOptions] = useState<tokenType[]>(tokens)
  const [percentaje, setPercentaje] = useState(0)


  useEffect(() => {
    //TODO
    //Deberia poder elegir solo los tokens comunes en las chains que tenga balance. Obtener con connectiosn de lify?
    //setTokensOptions(tokens)
  }, []);

  const onSliderChange = (percentage: number) => {
    if(!onFocusToken){
      return
    }

    const updatedToken = { ...onFocusToken, percentage };
    console.log(updatedToken)
    setOnFocusToken(updatedToken);
    const updatedTokens = selectedTokens.map(token =>
      token.coinKey === updatedToken.coinKey ? updatedToken : token
    );
    setSelectedTokens(updatedTokens);
  }

  const onAddToken = (token: tokenType) => {
    setSelectedTokens([...selectedTokens,
    {
      ...token,
      percentage: 0
    }
    ])
    const updatedTokensOptions = tokensOptions.filter(option => option.coinKey !== token.coinKey);
    setTokensOptions(updatedTokensOptions)
  }

  const onRemoveToken = (token: tokenType) => {
    const updatedTokens = selectedTokens.filter(selectedToken => selectedToken.coinKey !== token.coinKey);
    setSelectedTokens([...updatedTokens]);
    setTokensOptions([{ ...token }, ...tokensOptions])
  };

  function onSubmit() {
    setIsSubmitting(true);

    /*let txnPromise: Promise<any>;
    if (!account) {
      txnPromise = onSubmitWrapOrUnwrap();
    }

    txnPromise
      .then(() => {
        //onSubmitted();
      })
      .finally(() => {
        setIsSubmitting(false);
      });*/
  }


  const submitButtonState = useMemo(() => {

    if (isSubmitting) {
      return {
        text: `Rebalancing...`,
        disabled: true,
      };
    }

    if (error) {
      return {
        text: error,
        disabled: true,
      };
    }

    if (!selectedTokens || selectedTokens.length === 0) {
      return {
        text: "Rebalance",
        disabled: true,
      };
    }

    let text = "Rebalance";

    return {
      text,
      disabled: false,
    };
  }, []);


  return <div>
    <div className="flex flex-col text-sm font-medium">
      <div className="flex flex-col text-sm font-medium">
        <TokenDropdown
          tokens={tokensOptions}
          getToken={onAddToken}
          token={null}
          type="Token"
          oppositToken={null}
          className="flex justify-between border-1 rounded-full font-semibold px-[12px] py-2.5 items-center "
        />
      </div>
      <div className="my-8">
        <RebalanceSlider
          value={percentaje}
          onChange={onSliderChange}
          marks={[0, 50, 100]}
        />
      </div>
    </div>

    <div>
      <Button
        variant="primary-action"
        className={`mt-4 ${submitButtonState.disabled ? "opacity-50" : ""
          } w-full bg-main rounded-xl py-3 text-white font-semibold`}
        type="submit"
        onClick={onSubmit}
        disabled={submitButtonState.disabled}
      // disabled={submitButtonState.disabled && !shouldDisableValidation}
      >
        {submitButtonState.text}
      </Button>
    </div>

    {selectedTokens && selectedTokens.length > 0 && (
      selectedTokens.map(token => (
        <div key={token.coinKey}>
          <TokenCardRebalance
            token={token}
            onRemove={onRemoveToken}
            onSelected={setOnFocusToken}
            isSelected={onFocusToken === token} />
        </div>
      ))
    )}
  </div>;
}
