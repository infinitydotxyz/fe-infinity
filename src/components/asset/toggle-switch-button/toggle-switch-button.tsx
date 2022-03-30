import React, { useState } from 'react';
import clsx from 'classnames';
import classes from './toggle-switch-button.module.scss';

interface ToggleSwitchButtonProps {
  className?: string;
}

export const ToggleSwitchButton = ({ className = '' }: ToggleSwitchButtonProps) => {
  const [toggle, setToggle] = useState(false);

  const triggerToggle = () => {
    setToggle(!toggle);
  };

  const toggleClasses = clsx(classes.wrgToggle, {
    [className]: className,
    [classes.wrgToggleChecked]: toggle
  });

  return (
    <div onClick={triggerToggle} className={toggleClasses}>
      <div className={classes.wrgToggleCircle}></div>
      <div className={classes.wrgToggleContainer}>
        <div className={classes.wrgToggleCheck}>
          <span>NFT</span>
        </div>
        <div className={classes.wrgToggleUncheck}>
          <span>Game</span>
        </div>
      </div>

      <input type="checkbox" aria-label="Toggle Button" className={classes.wrgToggleInput} />
    </div>
  );
};
