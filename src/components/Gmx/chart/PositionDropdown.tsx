import { Menu } from "@headlessui/react";
// import { Trans } from "@lingui/macro";

import { HiDotsVertical } from "react-icons/hi";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSelectMultiple } from "react-icons/bi";
import { RiShareBoxFill } from "react-icons/ri";
import increaseLimit from "../../../../public/img/ic_increaselimit_16.svg";
import increaseMarket from "../../../../public/img/ic_increasemarket_16.svg";
import triggerClose from "../../../../public/img/ic_triggerclose_16.svg";

type Props = {
  handleEditCollateral?: () => void;
  handleShare?: () => void;
  handleMarketSelect?: () => void;
  handleMarketIncreaseSize?: () => void;
  handleLimitIncreaseSize?: () => void;
  handleTriggerClose?: () => void;
};

export default function PositionDropdown({
  handleEditCollateral,
  handleShare,
  handleMarketSelect,
  handleMarketIncreaseSize,
  handleLimitIncreaseSize,
  handleTriggerClose,
}: Props) {
  return (
    <Menu>
      <Menu.Button as="div">
        <button className="PositionDropdown-dots-icon">
          <HiDotsVertical fontSize={20} fontWeight={700} />
        </button>
      </Menu.Button>
      <div className="PositionDropdown-extra-options">
        <Menu.Items as="div" className="menu-items">
          {handleMarketSelect && (
            <Menu.Item>
              <div className="menu-item" onClick={handleMarketSelect}>
                <BiSelectMultiple fontSize={16} />
                <p>Select Market</p>
              </div>
            </Menu.Item>
          )}
          {handleEditCollateral && (
            <Menu.Item>
              <div className="menu-item" onClick={handleEditCollateral}>
                <AiOutlineEdit fontSize={16} />
                <p>Edit Collateral</p>
              </div>
            </Menu.Item>
          )}
          {handleMarketIncreaseSize && (
            <Menu.Item>
              <div className="menu-item" onClick={handleMarketIncreaseSize}>
                <img src={increaseMarket} alt="Increase Limit" height={16} />
                <p>Increase Size (Market)</p>
              </div>
            </Menu.Item>
          )}
          {handleLimitIncreaseSize && (
            <Menu.Item>
              <div className="menu-item" onClick={handleLimitIncreaseSize}>
                <img src={increaseLimit} alt="Increase Limit" height={16} />
                <p>Increase Size (Limit)</p>
              </div>
            </Menu.Item>
          )}
          {handleTriggerClose && (
            <Menu.Item>
              <div className="menu-item" onClick={handleTriggerClose}>
                <img src={triggerClose} alt="Increase Limit" height={16} />
                <p>Set TP/SL</p>
              </div>
            </Menu.Item>
          )}
          {handleShare && (
            <Menu.Item>
              <div className="menu-item" onClick={handleShare}>
                <RiShareBoxFill fontSize={16} />
                <p>Share Position</p>
              </div>
            </Menu.Item>
          )}
        </Menu.Items>
      </div>
    </Menu>
  );
}
