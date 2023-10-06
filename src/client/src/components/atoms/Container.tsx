import { cleanClasses } from "@/helpers/stringhelpers";
import React from "react";

export interface Props {
  children: React.ReactElement[];
  className?: string;
  center?: boolean;
  id?: string;
}

const Container: React.FC<Props> = ({
  id = "",
  center,
  className = "",
  children,
}) => (
  <div
    id={id}
    className={cleanClasses(
      `${center ? "justify-center items-center" : ""} ${className}`
    )}
  >
    {children}
  </div>
);
export default Container;
