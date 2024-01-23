import React from "react";
import styles from './Tab.module.scss';

export default function Tab(props) {
  const { options, option, setOption, onChange, type = "block", className, optionLabels, icons } = props;
  const onClick = (opt) => {
    if (setOption) {
      setOption(opt);
    }
    if (onChange) {
      onChange(opt);
    }
  };

  return (
    <div className={`${styles.Tab} ${styles[type]} ${className || ''}`}>
      {options.map((opt) => {
        const label = optionLabels && optionLabels[opt] ? optionLabels[opt] : opt;
        return (
          <div className={`${styles['Tab-option']} ${styles.muted} ${opt === option ? styles.active : ''}`} onClick={() => onClick(opt)} key={opt}>
            {icons && icons[opt] && <img className={styles['Tab-option-icon']} src={icons[opt]} alt={option} />}
            {label}
          </div>
        );
      })}
    </div>
  );
}
