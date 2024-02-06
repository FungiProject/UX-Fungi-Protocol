import { useCallback, useState, useRef, MouseEvent, ReactNode } from "react";

const OPEN_DELAY = 0;
const CLOSE_DELAY = 100;

export type TooltipPosition =
  | "left-bottom"
  | "right-bottom"
  | "left-top"
  | "right-top"
  | "right"
  | "center-bottom"
  | "center-top";

type Props = {
  handle: ReactNode;
  renderContent: () => ReactNode;
  position?: TooltipPosition;
  trigger?: string;
  className?: string;
  disableHandleStyle?: boolean;
  handleClassName?: string;
  isHandlerDisabled?: boolean;
};

export default function Tooltip(props: Props) {
  const [visible, setVisible] = useState(false);
  const intervalCloseRef = useRef<ReturnType<typeof setTimeout> | null>();
  const intervalOpenRef = useRef<ReturnType<typeof setTimeout> | null>();

  const position = props.position ?? "left-bottom";
  const trigger = props.trigger ?? "hover";

  const onMouseEnter = useCallback(() => {
    if (trigger !== "hover") return;
    if (intervalCloseRef.current) {
      clearInterval(intervalCloseRef.current);
      intervalCloseRef.current = null;
    }
    if (!intervalOpenRef.current) {
      intervalOpenRef.current = setTimeout(() => {
        setVisible(true);
        intervalOpenRef.current = null;
      }, OPEN_DELAY);
    }
  }, [setVisible, intervalCloseRef, intervalOpenRef, trigger]);

  const onMouseClick = useCallback(() => {
    if (trigger !== "click") return;
    if (intervalCloseRef.current) {
      clearInterval(intervalCloseRef.current);
      intervalCloseRef.current = null;
    }
    if (intervalOpenRef.current) {
      clearInterval(intervalOpenRef.current);
      intervalOpenRef.current = null;
    }

    setVisible(true);
  }, [setVisible, intervalCloseRef, trigger]);

  const onMouseLeave = useCallback(() => {
    intervalCloseRef.current = setTimeout(() => {
      setVisible(false);
      intervalCloseRef.current = null;
    }, CLOSE_DELAY);
    if (intervalOpenRef.current) {
      clearInterval(intervalOpenRef.current);
      intervalOpenRef.current = null;
    }
  }, [setVisible, intervalCloseRef]);

  const onHandleClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  //const className = cx("Tooltip", props.className);

  const tooltipClass = `text-black ${props.className || ""}`;
  const handleClass = `${props.disableHandleStyle ? "" : "active"} ${
    props.handleClassName || ""
  }`;

  return (
    <span
      className={tooltipClass}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
    >
      <span onClick={onHandleClick} className={handleClass}>
        {props.isHandlerDisabled ? (
          <div className="Tooltip-disabled-wrapper">{props.handle}</div>
        ) : (
          <>{props.handle}</>
        )}
      </span>
      {/* {visible && (
        <div
          className={`absolute w-96 z-50 bg-gray-100 p-2 rounded-lg text-black ${position}`}
        >
          {props.renderContent()}
        </div>
      )} */}
    </span>
  );
}
