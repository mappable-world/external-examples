import { ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "../styles/ui/Button.module.css";

type Props = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  size?: "big" | "medium";
  fontSize?: "medium" | "small";
  color?: "gray" | "yellow" | "transparent";
};

const cx = classNames.bind(styles);

export function Button({
  children,
  disabled,
  onClick,
  size = "medium",
  fontSize = "medium",
  color = "gray",
}: Props) {
  const fontClass = `${fontSize}Font`;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx("button", size, color, fontClass)}
    >
      {children}
    </button>
  );
}
