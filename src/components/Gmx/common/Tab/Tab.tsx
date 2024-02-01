import React from "react";

export default function Tab(props) {
  const {
    options,
    option,
    setOption,
    onChange,
    type = "block",
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
      {options.map((opt) => {
        const label =
          optionLabels && optionLabels[opt] ? optionLabels[opt] : opt;
        return (
          <div
            className={
              opt === option
                ? `${
                    !isSpan ? "bg-black text-white" : "text-black"
                  }  rounded-full p-[5px] flex items-center justify-center`
                : "bg-white flex items-center justify-center text-gray-500"
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
