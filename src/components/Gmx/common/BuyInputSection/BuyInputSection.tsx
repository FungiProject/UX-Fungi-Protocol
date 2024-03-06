import React, { useRef, ReactNode, ChangeEvent, useState } from "react";
import {
  INPUT_LABEL_SEPARATOR,
  PERCENTAGE_SUGGESTIONS,
} from "../../../../utils/gmx/config/ui";
import NumberInput from "../../gm/NumberInput/NumberInput";

type Props = {
  topLeftLabel: string;
  topLeftValue?: string;
  topRightLabel?: string;
  topRightValue?: string;
  getCliked?: (status: boolean) => void;
  bridgeComponent?: ReactNode;
  onClickTopRightLabel?: () => void;
  inputValue?: number | string;
  onInputValueChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickMax?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showMaxButton?: boolean;
  staticInput?: boolean;
  children?: ReactNode;
  showPercentSelector?: boolean;
  onPercentChange?: (percentage: number) => void;
  preventFocusOnLabelClick?: "left" | "right" | "both";
};

export default function BuyInputSection(props: Props) {
  const {
    topLeftLabel,
    topLeftValue,
    bridgeComponent,
    topRightLabel,
    topRightValue,
    onClickTopRightLabel,
    inputValue,
    onInputValueChange,
    onClickMax,
    onFocus,
    onBlur,
    showMaxButton,
    staticInput,
    children,
    showPercentSelector,
    onPercentChange,
    preventFocusOnLabelClick,
    getCliked,
  } = props;
  const [isPercentSelectorVisible, setIsPercentSelectorVisible] =
    useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOnFocus() {
    if (showPercentSelector && onPercentChange) {
      if (getCliked) {
        getCliked(true);
      }
      setIsPercentSelectorVisible(true);
    }
    onFocus?.();
  }

  function handleOnBlur() {
    if (showPercentSelector && onPercentChange) {
      if (getCliked) {
        getCliked(false);
      }
      setIsPercentSelectorVisible(false);
    }
    onBlur?.();
  }

  function handleBoxClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const labelElement = target.closest("[data-label]");
    const labelClicked = labelElement
      ? labelElement.getAttribute("data-label")
      : null;

    if (
      !(
        preventFocusOnLabelClick === labelClicked ||
        preventFocusOnLabelClick === "both"
      ) &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }

  function onUserInput(e) {
    if (onInputValueChange) {
      onInputValueChange(e);
    }
  }

  return (
    <div className="flex-1">
      <div className="flex-1" onClick={handleBoxClick}>
        <div className="flex-1 flex justify-between">
          <div className="flex justify-between">
            {bridgeComponent}
            {!staticInput && !bridgeComponent && (
              <NumberInput
                value={inputValue}
                className="outline-none placeholder:text-black"
                inputRef={inputRef}
                onValueChange={onUserInput}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                placeholder="0.00"
              />
            )}
            {staticInput && !bridgeComponent && (
              <div className="InputSection-static-input">{inputValue}</div>
            )}
          </div>
          <div className="flex">{children}</div>
        </div>
        <div className="flex justify-between mt-2">
          {bridgeComponent ? (
            <>
              {!staticInput && (
                <NumberInput
                  value={inputValue}
                  className="outline-none placeholder:text-black ml-2"
                  inputRef={inputRef}
                  onValueChange={onUserInput}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  placeholder="0.00"
                />
              )}
              {staticInput && (
                <div className="InputSection-static-input ml-2">
                  {inputValue}
                </div>
              )}
            </>
          ) : (
            <div data-label="left" className="text-sm text-black/70">
              {topLeftLabel}
              {topLeftValue && `${INPUT_LABEL_SEPARATOR} ${topLeftValue}`}
            </div>
          )}

          <div
            data-label="right"
            className={"align-right mb-2"}
            onClick={onClickTopRightLabel}
          >
            {showMaxButton && (
              <button
                type="button"
                className="text-main text-xs mr-2"
                onClick={onClickMax}
              >
                <span>MAX</span>
              </button>
            )}
            <span className="text-sm text-black/70">{topRightLabel}</span>
            {topRightValue && (
              <span className="text-black/70">
                {topRightLabel ? INPUT_LABEL_SEPARATOR : ""}&nbsp;
                <span className="text-black"> {topRightValue}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      {showPercentSelector && isPercentSelectorVisible && onPercentChange && (
        <ul className="flex w-full bg-gray-100 rounded-lg py-1 justify-between">
          {PERCENTAGE_SUGGESTIONS.map((percentage) => (
            <li
              className="hover:bg-black hover:text-white px-2 py-0.5 rounded-lg cursor-pointer"
              key={percentage}
              onMouseDown={() => {
                onPercentChange?.(percentage);
                handleOnBlur();
              }}
            >
              {percentage}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
