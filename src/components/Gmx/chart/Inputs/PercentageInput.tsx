import cx from "classnames";
import { BASIS_POINTS_DIVISOR } from "../../../../utils/gmx/config/factors";
import { roundToTwoDecimals } from "../../../../utils/gmx/lib/numbers";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const validDecimalRegex = /^\d+(\.\d{0,2})?$/; // 0.00 ~ 99.99

function getValueText(value: number) {
  return roundToTwoDecimals((value / BASIS_POINTS_DIVISOR) * 100).toString();
}

type Props = {
  onChange: (value: number) => void;
  defaultValue: number;
  maxValue?: number;
  highValue?: number;
  lowValue?: number;
  suggestions?: number[];
  lowValueWarningText?: ReactNode;
  highValueWarningText?: ReactNode;
  negativeSign?: boolean;
  highValueCheckStrategy?: "gte" | "gt";
};

const DEFAULT_SUGGESTIONS = [0.3, 0.5, 1, 1.5];

export default function PercentageInput({
  onChange,
  defaultValue,
  maxValue = 99 * 100,
  highValue,
  lowValue,
  suggestions = DEFAULT_SUGGESTIONS,
  highValueWarningText,
  lowValueWarningText,
  negativeSign,
  highValueCheckStrategy: checkStrategy = "gte",
}: Props) {
  const [inputValue, setInputvalue] = useState<string>(() =>
    getValueText(defaultValue)
  );
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);

  useEffect(() => {
    setInputvalue(getValueText(defaultValue));
  }, [defaultValue]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (value === "") {
      setInputvalue(value);
      onChange(defaultValue);
      return;
    }

    const parsedValue = Math.round(Number.parseFloat(value) * 100);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    if (parsedValue >= maxValue) {
      onChange(maxValue);
      setInputvalue(getValueText(maxValue));
      return;
    }

    if (validDecimalRegex.test(value)) {
      onChange(parsedValue);
      setInputvalue(value);
    }
  }

  const error = useMemo(() => {
    const parsedValue = Math.round(Number.parseFloat(inputValue) * 100);

    if (
      highValue &&
      ((checkStrategy === "gte" && parsedValue >= highValue) ||
        (checkStrategy === "gt" && parsedValue > highValue))
    ) {
      return highValueWarningText;
    }

    if (lowValueWarningText && lowValue && parsedValue < lowValue) {
      return lowValueWarningText;
    }
  }, [
    inputValue,
    highValue,
    checkStrategy,
    lowValueWarningText,
    lowValue,
    highValueWarningText,
  ]);

  const id = useMemo(() => Math.random().toString(36), []);

  const shouldShowPanel = isPanelVisible && Boolean(suggestions.length);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSignClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      <div className="absolute right-0 flex">
        {negativeSign && (
          <span
            className="Percentage-input-negative-sign"
            onClick={handleSignClick}
          >
            -
          </span>
        )}
        <input
          id={id}
          ref={inputRef}
          onFocus={() => setIsPanelVisible(true)}
          onBlur={() => setIsPanelVisible(false)}
          value={inputValue ? inputValue : ""}
          placeholder={inputValue || getValueText(defaultValue)}
          autoComplete="off"
          onChange={handleChange}
          className="w-10"
        />
        <label htmlFor={id}>
          <span>%</span>
        </label>
      </div>{" "}
      {error && !shouldShowPanel && (
        <div
          className={cx(
            "Percentage-input-error",
            "Tooltip-popup",
            "z-index-1001",
            "right-bottom"
          )}
        >
          {error}
        </div>
      )}
      {shouldShowPanel && (
        <ul className="flex  bg-gray-100 rounded-lg py-1 justify-between absolute top-7 right-0 border-1 h-fit">
          {suggestions.map((slippage) => (
            <li
              key={slippage}
              onMouseDown={() => {
                setInputvalue(String(slippage));
                onChange(slippage * 100);
                setIsPanelVisible(false);
              }}
              className="flex hover:bg-black hover:text-white px-2 py-0.5 rounded-lg cursor-pointer"
            >
              {slippage}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
