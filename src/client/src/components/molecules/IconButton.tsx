import React, { useState } from "react";
import Button from "../atoms/Button";

export interface Props {
  icon?: React.ReactNode;
  onClick: () => void;
  preset?: "like" | "none";
  disabled?: boolean;
  children?: React.ReactNode;
}

const IconButton: React.FC<Props> = ({
  icon,
  onClick,
  preset = "none",
  disabled = false,
  children
}) => {
  const [active, setActive] = useState(false);
  const classNames =
    (preset === "like" ? (active ? "!text-red-500" : "!text-gray-400") : "") +
    " !p-2 !rounded-full !bg-inherit shadow-none hover:shadow-none";

  const icon2 =
    preset === "like" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    ) : (
      icon
    );

  return (
    <Button
      className={classNames}
      disabled={disabled}
      onClick={() => {
        setActive(!active);
        onClick();
      }}
    >
      {icon2}
    </Button>
  );
};

export default IconButton;
