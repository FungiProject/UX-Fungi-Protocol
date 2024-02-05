//import { Trans, plural, t } from "@lingui/macro";
import cx from "classnames";
//import { ApproveTokenButton } from "components/ApproveTokenButton/ApproveTokenButton";
import Modal from "../common/Modal/Modal";
import { getContract } from "@/utils/gmx/config/contracts";
import { ExecutionFee } from "@/utils/gmx/domain/synthetics/fees";
import { useMarkets } from "@/utils/gmx/domain/synthetics/markets";
import { createDepositTxn } from "@/utils/gmx/domain/synthetics/markets";
import { createWithdrawalTxn } from "@/utils/gmx/domain/synthetics/markets";
import { getNeedTokenApprove, getTokenData, useTokensData } from "@/utils/gmx/domain/synthetics/tokens";
import { TokenData } from "@/utils/gmx/domain/tokens/types";
import { useTokensAllowanceData } from "@/utils/gmx/domain/synthetics/tokens/useTokenAllowanceData";
import { GmSwapFees } from "@/utils/gmx/domain/synthetics/trade";
import { BigNumber } from "ethers";
import { useChainId } from "@/utils/gmx/lib/chains";
import { formatTokenAmountWithUsd } from "@/utils/gmx/lib/numbers";
import { getByKey } from "@/utils/gmx/lib/objects";
import { uniq } from "lodash";
import { GmFees } from "./GmFees/GmFees"
import Button from "../common/Buttons/Button";
import { DEFAULT_SLIPPAGE_AMOUNT } from "@/utils/gmx/config/factors";
import { useSyntheticsEvents } from "@/utils/gmx/context/SyntheticsEvents";
import { useState } from "react";
//import "./GmConfirmationBox.scss";
import { useKey } from "react-use";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { createWithdrawalUserOp } from "@/utils/gmx/domain/synthetics/markets/createWithdrawalUserOp";
import { createDepositUserOp } from "@/utils/gmx/domain/synthetics/markets/createDepositUserOp";
import { createApproveTokensUserOp } from "@/utils/gmx/domain/tokens/approveTokensUserOp";
import { sendUserOperations } from "@/utils/gmx/lib/userOperations/sendUserOperations";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";

type Props = {
  isVisible: boolean;
  marketToken?: TokenData;
  longToken?: TokenData;
  shortToken?: TokenData;
  marketTokenAmount: BigNumber;
  marketTokenUsd: BigNumber;
  longTokenAmount?: BigNumber;
  longTokenUsd?: BigNumber;
  shortTokenAmount?: BigNumber;
  shortTokenUsd?: BigNumber;
  fees?: GmSwapFees;
  error?: string;
  isDeposit: boolean;
  executionFee?: ExecutionFee;
  isHighPriceImpact: boolean;
  isHighPriceImpactAccepted: boolean;
  setIsHighPriceImpactAccepted: (value: boolean) => void;
  onSubmitted: () => void;
  onClose: () => void;
  setPendingTxns: (txns: any) => void;
  shouldDisableValidation?: boolean;
};

export function GmConfirmationBox({
  isVisible,
  marketToken,
  longToken,
  shortToken,
  marketTokenAmount,
  marketTokenUsd,
  longTokenAmount,
  longTokenUsd,
  shortTokenAmount,
  shortTokenUsd,
  fees,
  error,
  isDeposit,
  executionFee,
  onSubmitted,
  onClose,
  setPendingTxns,
  shouldDisableValidation,
}: Props) {
  const { scAccount } = useWallet(); //TODO fungi
  const {alchemyProvider} = useAlchemyAccountKitContext();
  const { chainId } = useChainId();
  const { marketsData } = useMarkets(chainId);
  const { tokensData } = useTokensData(chainId);
  const { setPendingDeposit, setPendingWithdrawal } = useSyntheticsEvents();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const market = getByKey(marketsData, marketToken?.address);

  const routerAddress = getContract(chainId, "SyntheticsRouter");

  const payTokenAddresses = (function getPayTokenAddresses() {
    if (!marketToken) {
      return [];
    }

    const addresses: string[] = [];

    if (isDeposit) {
      if (longTokenAmount?.gt(0) && longToken) {
        addresses.push(longToken.address);
      }
      if (shortTokenAmount?.gt(0) && shortToken) {
        addresses.push(shortToken.address);
      }
    } else {
      addresses.push(marketToken.address);
    }

    return uniq(addresses);
  })();

  const { tokensAllowanceData } = useTokensAllowanceData(chainId, {
    spenderAddress: routerAddress,
    tokenAddresses: payTokenAddresses,
    skip: !isVisible,
  });

  const tokensToApprove = (function getTokensToApprove() {
    const addresses: string[] = [];

    if (!tokensAllowanceData) {
      return addresses;
    }

    if (isDeposit) {
      if (
        longTokenAmount?.gt(0) &&
        longToken &&
        getNeedTokenApprove(tokensAllowanceData, longToken?.address, longTokenAmount)
      ) {
        addresses.push(longToken.address);
      }

      if (
        shortTokenAmount?.gt(0) &&
        shortToken &&
        getNeedTokenApprove(tokensAllowanceData, shortToken?.address, shortTokenAmount)
      ) {
        addresses.push(shortToken.address);
      }
    } else {
      if (
        marketTokenAmount.gt(0) &&
        marketToken &&
        getNeedTokenApprove(tokensAllowanceData, marketToken.address, marketTokenAmount)
      ) {
        addresses.push(marketToken.address);
      }
    }

    return uniq(addresses);
  })();

  const longSymbol = market?.isSameCollaterals ? `${longToken?.symbol} Long` : longToken?.symbol;
  const shortSymbol = market?.isSameCollaterals ? `${shortToken?.symbol} Short` : shortToken?.symbol;

  const longTokenText = longTokenAmount?.gt(0)
    ? formatTokenAmountWithUsd(longTokenAmount, longTokenUsd, longSymbol, longToken?.decimals)
    : undefined;

  const shortTokenText = shortTokenAmount?.gt(0)
    ? formatTokenAmountWithUsd(shortTokenAmount, shortTokenUsd, shortSymbol, shortToken?.decimals)
    : undefined;

  const marketTokenText = formatTokenAmountWithUsd(
    marketTokenAmount,
    marketTokenUsd,
    marketToken?.symbol,
    marketToken?.decimals
  );

  const operationText = isDeposit ? `Buy` : `Sell`;

  const isAllowanceLoaded = Boolean(tokensAllowanceData);

  const submitButtonState = (function getSubmitButtonState() {
    if (payTokenAddresses.length > 0 && !isAllowanceLoaded) {
      return {
        text: `Loading...`,
        disabled: true,
      };
    }

    const onSubmit = () => {
      setIsSubmitting(true);

      let txnPromise: Promise<any>;

      if (isDeposit) {
        txnPromise = onCreateDeposit();
      } else {
        txnPromise = onCreateWithdrawal();
      }

      txnPromise
        .then(() => {
          onSubmitted();
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    if (error) {
      return {
        text: error,
        disabled: !shouldDisableValidation,
        onClick: onSubmit,
      };
    }

    if (isSubmitting) {
      return {
        text: isDeposit ? `Buying GM...` : `Selling GM...`,
        disabled: true,
      };
    }

    /*if (tokensToApprove.length > 0 && marketToken) {
      const symbols = tokensToApprove.map((address) => {
        const token = getTokenData(tokensData, address)!;
        return address === marketToken.address ? "GM" : token?.assetSymbol ?? token?.symbol;
      });

      const symbolsText = symbols.join(", ");

      return {
        text: plural(symbols.length, {
          one: `Pending ${symbolsText} approval`,
          other: `Pending ${symbolsText} approvals`,
        }),
        disabled: true,
      };
    }*/

    const operationText = isDeposit ? `Buy` : `Sell`;
    const text = `Confirm ${operationText}`;

    return {
      text,
      onClick: onSubmit,
    };
  })();

  useKey(
    "Enter",
    () => {
      if (isVisible && submitButtonState.onClick && !submitButtonState.disabled) {
        submitButtonState.onClick();
      }
    },
    {},
    [isVisible, submitButtonState]
  );

  async function onCreateDeposit() {
    if (!scAccount || !executionFee || !marketToken || !market || !marketTokenAmount ) {
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address) =>
      createApproveTokensUserOp({ tokenAddress: address, spender: routerAddress })
    )
    
    const depositUserOp = await createDepositUserOp(chainId,{
        account: scAccount,
        initialLongTokenAddress: longToken?.address || market.longTokenAddress,
        initialShortTokenAddress: shortToken?.address || market.shortTokenAddress,
        longTokenSwapPath: [],
        shortTokenSwapPath: [],
        longTokenAmount: longTokenAmount || BigNumber.from(0),
        shortTokenAmount: shortTokenAmount || BigNumber.from(0),
        marketTokenAddress: marketToken.address,
        minMarketTokens: marketTokenAmount,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage: DEFAULT_SLIPPAGE_AMOUNT
    })

    userOps.push(depositUserOp)

    return sendUserOperations(alchemyProvider, chainId, userOps)

  }

  async function onCreateWithdrawal() {
    if (
      !scAccount ||
      !market ||
      !marketToken ||
      !executionFee ||
      !longTokenAmount ||
      !shortTokenAmount
    ) {
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address) =>
        createApproveTokensUserOp({ tokenAddress: address, spender: routerAddress })
      )

    const withdrawalUserOp = createWithdrawalUserOp(chainId, {
        account: scAccount,
        initialLongTokenAddress: longToken?.address || market.longTokenAddress,
        initialShortTokenAddress: shortToken?.address || market.shortTokenAddress,
        longTokenSwapPath: [],
        shortTokenSwapPath: [],
        marketTokenAmount: marketTokenAmount,
        minLongTokenAmount: longTokenAmount,
        minShortTokenAmount: shortTokenAmount,
        marketTokenAddress: marketToken.address,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage: DEFAULT_SLIPPAGE_AMOUNT,
    })

    userOps.push(withdrawalUserOp);

    return sendUserOperations(alchemyProvider, chainId, userOps)
  }

  return (
    <div className="Confirmation-box GmConfirmationBox">
      <Modal isVisible={isVisible} setIsVisible={onClose} label={`Confirm ${operationText}`} allowContentTouchMove>
        {isVisible && (
          <>
            <div>
              {isDeposit && (
                <>
                  {[longTokenText, shortTokenText].filter(Boolean).map((text) => (
                    <div key={text}>
                      {/*<Trans>Pay</Trans> {text}*/}
                      <span>Pay {text}</span>
                    </div>
                  ))}
                  <div className="Confirmation-box-main-icon"></div>
                  <div>
                    {/*<Trans>Receive</Trans> {marketTokenText}*/}
                    <span>Receive</span> {marketTokenText}
                  </div>
                </>
              )}
              {!isDeposit && (
                <>
                  <div>
                    {/*<Trans>Pay</Trans>&nbsp;{marketTokenText}*/}
                    <span>Pay</span>&nbsp;{marketTokenText}
                  </div>
                  <div className="Confirmation-box-main-icon"></div>
                  {[longTokenText, shortTokenText].filter(Boolean).map((text) => (
                    <div key={text}>
                      {/*<Trans>Receive</Trans>&nbsp;{text}*/}
                      <span>Receive</span>&nbsp;{text}
                    </div>
                  ))}
                </>
              )}
            </div>

            <GmFees
              isDeposit={isDeposit}
              totalFees={fees?.totalFees}
              uiFee={fees?.uiFee}
              swapFee={fees?.swapFee}
              swapPriceImpact={fees?.swapPriceImpact}
              executionFee={executionFee}
            />
            {/*tokensToApprove?.length > 0 && <div className="line-divider" />*/}

            {/*tokensToApprove && tokensToApprove.length > 0 && (
              <div>
                {tokensToApprove.map((address) => {
                  const token = getTokenData(tokensData, address)!;
                  return (
                    <div key={address}>
                      <ApproveTokenButton
                        key={address}
                        tokenAddress={address}
                        tokenSymbol={address === marketToken?.address ? "GM" : token.assetSymbol ?? token.symbol}
                        spenderAddress={routerAddress}
                      />
                    </div>
                  );
                })}
              </div>
            )*/}

            <div>
              <Button
                className="w-full bg-main rounded-xl py-3 text-white font-semibold"
                type="submit"
                variant="primary-action"
                onClick={submitButtonState.onClick}
                disabled={submitButtonState.disabled}
              >
                {submitButtonState.text}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
