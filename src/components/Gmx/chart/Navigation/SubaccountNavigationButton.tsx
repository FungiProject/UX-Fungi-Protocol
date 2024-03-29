import ExternalLink from "../../common/ExternalLink/ExternalLink";
import { NavigationButton } from "./NavigationButton";
import TooltipWithPortal from "../../common/Tooltip/TooltipWithPortal";
import {
  getNativeToken,
  getWrappedToken,
} from "../../../../utils/gmx/config/tokens";
import {
  useIsSubaccountActive,
  useSubaccountActionCounts,
  useSubaccountInsufficientFunds,
  useSubaccountModalOpen,
} from "../../../../utils/gmx/context/SubaccountContext/SubaccountContext";
import { SUBACCOUNT_DOCS_URL } from "../../../../utils/gmx/domain/synthetics/subaccount/constants";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import { BigNumber } from "ethers";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { useLocalStorageSerializeKey } from "../../../../utils/gmx/lib/localstorage";
import { ReactNode, memo, useCallback } from "react";
import {
  ONE_CLICK_TRADING_NATIVE_TOKEN_WARN_HIDDEN,
  ONE_CLICK_TRADING_OFFER_HIDDEN,
} from "../../../../utils/gmx/config/localStorage";

export const SubaccountNavigationButton = memo(
  ({
    closeConfirmationBox,
    executionFee,
    isNativeToken,
    tradeFlags,
  }: {
    closeConfirmationBox: () => void;
    executionFee: BigNumber | undefined;
    isNativeToken?: boolean;
    tradeFlags: TradeFlags | undefined;
  }) => {
    const isSubaccountActive = useIsSubaccountActive();
    const [, setModalOpen] = useSubaccountModalOpen();
    const { chainId } = useChainId();

    const insufficientFunds = useSubaccountInsufficientFunds(executionFee);

    const jumpToSubaccount = useCallback(() => {
      closeConfirmationBox();
      setModalOpen(true);
    }, [closeConfirmationBox, setModalOpen]);

    const [offerButtonHidden, setOfferButtonHidden] =
      useLocalStorageSerializeKey(ONE_CLICK_TRADING_OFFER_HIDDEN, false);
    const [nativeTokenWarningHidden, setNativeTokenWarningHidden] =
      useLocalStorageSerializeKey(
        ONE_CLICK_TRADING_NATIVE_TOKEN_WARN_HIDDEN,
        false
      );

    const handleCloseOfferClick = useCallback(() => {
      setOfferButtonHidden(true);
    }, [setOfferButtonHidden]);

    const handleCloseNativeTokenWarningClick = useCallback(() => {
      setNativeTokenWarningHidden(true);
    }, [setNativeTokenWarningHidden]);

    const { remaining } = useSubaccountActionCounts();

    const shouldShowInsufficientFundsButton =
      isSubaccountActive && insufficientFunds && !isNativeToken;
    const shouldShowOfferButton =
      !isSubaccountActive && !offerButtonHidden && !isNativeToken;
    const shouldShowAllowedActionsWarning =
      isSubaccountActive && remaining?.eq(0) && !isNativeToken;
    const shouldShowNativeTokenWarning =
      !tradeFlags?.isTrigger &&
      isSubaccountActive &&
      !nativeTokenWarningHidden &&
      isNativeToken;

    let content: ReactNode = null;
    let onCloseClick: null | (() => void) = null;

    const renderTooltipContent = useCallback(() => {
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <span>
            Reduce wallet signing popups with One-Click Trading. This option is
            also available through the Wallet menu in the top right.{" "}
            <ExternalLink href={SUBACCOUNT_DOCS_URL}>More Info</ExternalLink>.
          </span>
        </div>
      );
    }, []);

    let clickable = true;

    if (shouldShowNativeTokenWarning) {
      const wrappedToken = getWrappedToken(chainId);
      const nativeToken = getNativeToken(chainId);
      clickable = false;
      onCloseClick = handleCloseNativeTokenWarningClick;
      content = (
        <span>
          One-Click Trading is not available using network's native token{" "}
          {nativeToken.symbol}. Consider using {wrappedToken.symbol} as Pay
          token instead.
        </span>
      );
    } else if (shouldShowAllowedActionsWarning) {
      content = (
        <span>
          The previously authorized maximum number of Actions has been reached
          for One-Click Trading. Click here to re-authorize.
        </span>
      );
    } else if (shouldShowInsufficientFundsButton) {
      content = (
        <span>
          There are insufficient funds in your Subaccount for One-Click Trading.
          Click here to top-up.
        </span>
      );
    } else if (shouldShowOfferButton) {
      onCloseClick = handleCloseOfferClick;
      content = (
        <TooltipWithPortal
          shouldHandleStopPropagation={isTouchDevice()}
          position="left-bottom"
          handle={<span>Enable One-Click Trading</span>}
          renderContent={renderTooltipContent}
        />
      );
    } else {
      return null;
    }

    return (
      <NavigationButton
        onCloseClick={onCloseClick}
        onNavigateClick={clickable ? jumpToSubaccount : undefined}
        className="SubaccountNavigationButton"
      >
        {content}
      </NavigationButton>
    );
  }
);

function isTouchDevice() {
  return "ontouchstart" in window;
}

export default SubaccountNavigationButton;
