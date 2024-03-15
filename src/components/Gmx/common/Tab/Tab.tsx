import React, { useState } from "react";

export default function Tab(props) {
  const {
    options,
    option,
    setOption,
    onChange,
    className,
    optionLabels,
    icons,
    isSpan,
  } = props;
  const onClick = (opt) => {
    if (setOption) {
      setOption(opt);
    }
    if (onChange) {
      onChange(opt);
    }
  };

  return (
    <div className={className}>
      {options.map((opt: string) => {
        const label =
          optionLabels && optionLabels[opt] ? optionLabels[opt] : opt;
        return (
          <div
            className={
              opt === option
                ? `${
                    !isSpan ? "bg-black text-white" : "text-black "
                  }  rounded-full p-[5px] flex items-center justify-center`
                : `bg-white flex items-center justify-center text-gray-500  ${
                    !isSpan
                      ? "hover:bg-gray-100 hover:rounded-full hover:py-[5px]"
                      : "hover:text-gray-700"
                  } mx-2 cursor-pointer`
            }
            onClick={() => onClick(opt)}
            key={opt}
          >
            {icons && icons[opt] && (
              <img src={icons[opt]} alt={option} className="mr-4" />
            )}
            {label}
          </div>
        );
      })}
    </div>
  );
}
